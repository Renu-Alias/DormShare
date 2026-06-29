import jwt from "jsonwebtoken";
import crypto from "crypto";

const demoUser = (email) => ({
  _id: crypto.randomBytes(12).toString("hex"),
  name: email.split("@")[0] || "User",
  collegeEmail: email.toLowerCase(),
  hostelBlock: "A Block",
  verified: true,
});

export const register = async (req, res) => {
  try {
    const { name, collegeEmail, password, hostelBlock } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }
    if (!collegeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collegeEmail)) {
      return res.status(400).json({ message: "Valid college email is required" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = {
      _id: crypto.randomBytes(12).toString("hex"),
      name,
      collegeEmail: collegeEmail.toLowerCase(),
      hostelBlock: hostelBlock || "A Block",
      verified: true,
    };

    const token = jwt.sign(
      { id: user._id, name: user.name, collegeEmail: user.collegeEmail, hostelBlock: user.hostelBlock },
      process.env.JWT_SECRET || "dev-secret-key",
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    res.status(201).json({ ...user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { collegeEmail, password } = req.body;

    if (!collegeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collegeEmail)) {
      return res.status(400).json({ message: "Valid college email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = {
      _id: crypto.randomBytes(12).toString("hex"),
      name: collegeEmail.split("@")[0] || "User",
      collegeEmail: collegeEmail.toLowerCase(),
      hostelBlock: "A Block",
      verified: true,
    };

    const token = jwt.sign(
      { id: user._id, name: user.name, collegeEmail: user.collegeEmail, hostelBlock: user.hostelBlock },
      process.env.JWT_SECRET || "dev-secret-key",
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    res.status(200).json({ ...user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret-key");
    res.status(200).json({
      _id: decoded.id,
      name: decoded.name,
      collegeEmail: decoded.collegeEmail,
      hostelBlock: decoded.hostelBlock,
      verified: true,
    });
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const updateProfile = async (req, res) => {
  res.status(200).json({ message: "Profile updated" });
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters" });
  }
  res.status(200).json({ message: "Password updated successfully" });
};

export const forgotPassword = async (req, res) => {
  res.status(200).json({ message: "Password reset email sent (demo mode)" });
};

export const resetPassword = async (req, res) => {
  res.status(200).json({ message: "Password reset successful (demo mode)" });
};
