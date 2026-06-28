import express from "express";
import {
    createItem,
    getItems,
    getMyItems,
    getItemById,
    updateItem,
    deleteItem,
    toggleAvailability
} from "../controllers/itemController.js";
import { protect } from "../middleware/auth.js";
import { validateItem } from "../middleware/validation.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post("/", protect, upload.array("images", 5), validateItem, createItem);
router.get("/", protect, getItems);
router.get("/myitems", protect, getMyItems);
router.get("/:id", protect, getItemById);
router.put("/:id", protect, validateItem, updateItem);
router.delete("/:id", protect, deleteItem);
router.patch("/:id/availability", protect, toggleAvailability);

export default router;
