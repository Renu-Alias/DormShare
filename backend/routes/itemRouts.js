import express from "express";
import path from "path";
import { fileURLToPath } from "url";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const uploadsDir = path.resolve(__dirname, "..", "uploads");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
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
