import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRouts.js";
import leaseRoutes from "./routes/leaseRoutes.js";
import cron from "node-cron";
import transporter from "./config/smtp.js";
import BorrowRecord from "./models/borrowrecord.js";
import { protect } from "./middleware/auth.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

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

cron.schedule("0 8 * * *", async () => {
    console.log("Running cron job: Checking for upcoming lease returns...");
    try {
        const now = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(now.getDate() + 3);

        const upcomingLeases = await BorrowRecord.find({
            status: { $in: ["Active", "Borrowed"] },
            expectedReturnDate: { $lte: threeDaysFromNow, $gte: now }
        }).populate("borrower", "collegeEmail name").populate("item", "title");

        for (const lease of upcomingLeases) {
            if (lease.borrower && lease.borrower.collegeEmail) {
                await transporter.sendMail({
                    from: process.env.FROM_EMAIL || "noreply@dormshare.com",
                    to: lease.borrower.collegeEmail,
                    subject: "Reminder: Item return due soon",
                    text: `Hello ${lease.borrower.name},\n\nJust a reminder that the item "${lease.item?.title}" you borrowed is due for return on ${lease.expectedReturnDate.toDateString()}.\n\nPlease return it on time.\n\n- DormShare Team`
                });
            }
        }

        console.log(`Sent ${upcomingLeases.length} reminder(s)`);
    } catch (error) {
        console.error("Cron job error:", error);
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
