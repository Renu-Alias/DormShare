import crypto from "crypto";
import User from "../models/user.js";
import transporter from "../config/smtp.js";
import { generateToken } from "../middleware/auth.js";
import {
    validateRegister,
    validateLogin
} from "../middleware/validation.js";

const allowedDomains = process.env.ALLOWED_EMAIL_DOMAINS
    ? process.env.ALLOWED_EMAIL_DOMAINS.split(",")
    : null;

const isValidCollegeEmail = (email) => {
    if (!allowedDomains) return true;
    const domain = email.split("@")[1];
    return allowedDomains.some((allowed) => domain === allowed.replace("@", ""));
};

export const register = async (req, res) => {
    try {
        const { name, collegeEmail, password, hostelBlock } = req.body;

        const existingUser = await User.findOne({ collegeEmail: collegeEmail.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this college email" });
        }

        if (!isValidCollegeEmail(collegeEmail)) {
            return res.status(400).json({ message: "Only verified institutional email domains are allowed" });
        }

        const user = await User.create({
            name,
            collegeEmail,
            password,
            hostelBlock
        });

        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            collegeEmail: user.collegeEmail,
            hostelBlock: user.hostelBlock,
            token
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { collegeEmail, password } = req.body;

        const user = await User.findOne({ collegeEmail: collegeEmail.toLowerCase() }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            collegeEmail: user.collegeEmail,
            hostelBlock: user.hostelBlock,
            verified: user.verified,
            token
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (req.body.name) user.name = req.body.name;
        if (req.body.hostelBlock) user.hostelBlock = req.body.hostelBlock;
        if (req.body.roomNumber) user.roomNumber = req.body.roomNumber;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("+password");

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current password and new password are required" });
        }

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters" });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { collegeEmail } = req.body;
        const user = await User.findOne({ collegeEmail: collegeEmail.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: "No user found with that email" });
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/api/reset-password/${rawToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a POST request to: \n\n ${resetUrl}`;

        await transporter.sendMail({
            from: process.env.FROM_EMAIL || "noreply@dormshare.com",
            to: user.collegeEmail,
            subject: "DormShare Password Reset",
            text: message
        });

        res.status(200).json({ message: "Email sent" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

