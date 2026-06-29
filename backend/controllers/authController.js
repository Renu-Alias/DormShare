import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { sendPasswordResetEmail } from "../utils/email.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "dev-secret-key", {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).cookie("token", token, cookieOptions).json({
    _id: user._id,
    name: user.name,
    collegeEmail: user.collegeEmail,
    hostelBlock: user.hostelBlock,
    roomNumber: user.roomNumber || "",
    profileImage: user.profileImage || "",
    verified: user.verified,
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, collegeEmail, password, hostelBlock } = req.body;

    if (!name || name.trim().length < 2)
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    if (!collegeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collegeEmail))
      return res.status(400).json({ message: "Valid college email is required" });
    if (!password || password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const exists = await User.findOne({ collegeEmail: collegeEmail.toLowerCase() });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({
      name,
      collegeEmail: collegeEmail.toLowerCase(),
      password,
      hostelBlock: hostelBlock || "A Block",
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ message: "Database unavailable. Please try again later." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { collegeEmail, password } = req.body;

    if (!collegeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collegeEmail))
      return res.status(400).json({ message: "Valid college email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    const user = await User.findOne({ collegeEmail: collegeEmail.toLowerCase() }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: "Database unavailable. Please try again later." });
  }
};

export const logoutUser = async (req, res) => {
  res
    .status(200)
    .cookie("token", "none", { httpOnly: true, expires: new Date(Date.now() + 5000) })
    .json({ message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(401).json({ message: "User not found" });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      collegeEmail: user.collegeEmail,
      hostelBlock: user.hostelBlock,
      roomNumber: user.roomNumber || "",
      profileImage: user.profileImage || "",
      verified: user.verified,
    });
  } catch (error) {
    res.status(500).json({ message: "Database unavailable. Please try again later." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowed = {};
    if (req.body.name) allowed.name = req.body.name;
    if (req.body.hostelBlock) allowed.hostelBlock = req.body.hostelBlock;
    if (req.body.roomNumber !== undefined) allowed.roomNumber = req.body.roomNumber;
    if (req.body.profileImage !== undefined) allowed.profileImage = req.body.profileImage;

    const user = await User.findByIdAndUpdate(req.user._id, allowed, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      _id: user._id,
      name: user.name,
      collegeEmail: user.collegeEmail,
      hostelBlock: user.hostelBlock,
      roomNumber: user.roomNumber || "",
      profileImage: user.profileImage || "",
      verified: user.verified,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: "Current password and new password are required" });
  if (newPassword.length < 6)
    return res.status(400).json({ message: "New password must be at least 6 characters" });

  try {
    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { collegeEmail } = req.body;

    if (!collegeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collegeEmail)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    const user = await User.findOne({ collegeEmail: collegeEmail.toLowerCase() });
    if (!user) {
      return res.status(200).json({ message: "If that email is registered, a password reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CORS_ORIGIN || "http://localhost:5173"}/reset-password/${resetToken}`;

    await sendPasswordResetEmail(user.collegeEmail, user.name, resetUrl);

    res.status(200).json({ message: "If that email is registered, a password reset link has been sent." });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful. You can now sign in." });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
