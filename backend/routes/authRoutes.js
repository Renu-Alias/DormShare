import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validateRegister, validateLogin } from "../middleware/validation.js";

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getMe);
router.put("/updateprofile", protect, updateProfile);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:token", resetPassword);

export default router;
