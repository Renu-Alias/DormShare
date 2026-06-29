import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRouts.js";
import leaseRoutes from "./routes/leaseRoutes.js";
import rateLimit from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

connectDB();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP. Please try again later."
});

const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(limiter);

app.get("/", (req, res) => {
    res.send("DormShare API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/leases", leaseRoutes);

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
};

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
