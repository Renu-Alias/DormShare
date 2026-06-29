import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized to access this route" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret-key");
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = { _id: user._id, id: user._id, name: user.name, collegeEmail: user.collegeEmail, hostelBlock: user.hostelBlock };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export { protect as auth };
