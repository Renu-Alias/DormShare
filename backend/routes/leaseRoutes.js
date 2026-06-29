import express from "express";
import {
    borrowItem,
    approveBorrow,
    rejectBorrow,
    returnItem,
    requestExtension,
    approveExtension,
    rejectExtension,
    getMyLeases,
    getLeaseById,
    markOverdue
} from "../controllers/leaseController.js";
import { protect } from "../middleware/auth.js";
import { validateLease, validateExtension } from "../middleware/validation.js";

const router = express.Router();

router.post("/borrow", protect, validateLease, borrowItem);
router.put("/:id/approve", protect, approveBorrow);
router.put("/:id/reject", protect, rejectBorrow);
router.put("/:id/return", protect, returnItem);
router.post("/:id/request-extension", protect, validateExtension, requestExtension);
router.put("/:id/approve-extension", protect, approveExtension);
router.put("/:id/reject-extension", protect, rejectExtension);
router.get("/myleases", protect, getMyLeases);
router.get("/:id", protect, getLeaseById);
router.put("/:id/mark-overdue", protect, markOverdue);

export default router;
