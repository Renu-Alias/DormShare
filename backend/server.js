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

const startServer = (app) => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

const waitForDbAndStart = async () => {
    const maxRetries = parseInt(process.env.DB_MAX_RETRIES || '5', 10);
    const baseDelay = parseInt(process.env.DB_RETRY_BASE_MS || '2000', 10);

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const ok = await connectDB();
            if (ok) {
                startServer(app);
                return;
            }
        } catch (err) {
            console.error('Unexpected error while connecting to DB:', err.message || err);
        }

        if (attempt < maxRetries) {
            const delay = baseDelay * Math.pow(2, attempt);
            console.log(`DB connect attempt ${attempt + 1} failed — retrying in ${delay}ms`);
            await new Promise(r => setTimeout(r, delay));
        } else {
            console.error(`DB connect failed after ${maxRetries + 1} attempts.`);
        }
    }

    if (process.env.DB_FAIL_FAST === 'true') {
        console.error('DB_FAIL_FAST is true — exiting process.');
        process.exit(1);
    }

    // Start server without DB, but keep attempting background reconnects
    console.warn('Starting server without DB connection; background reconnects will continue.');
    startServer(app);

    const bgIntervalMs = parseInt(process.env.DB_RECONNECT_INTERVAL_MS || '60000', 10);
    setInterval(async () => {
        try {
            const ok = await connectDB();
            if (ok) console.log('Background DB reconnect succeeded.');
        } catch (e) {
            console.debug('Background DB reconnect failed.');
        }
    }, bgIntervalMs);
};

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

// Start the app after attempting DB connection (with retries and background reconnect)
waitForDbAndStart();
