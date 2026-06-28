import BorrowRecord from "../models/borrowrecord.js";
import Item from "../models/item.js";
import User from "../models/user.js";
import { protect } from "../middleware/auth.js";
import { validateLease, validateExtension } from "../middleware/validation.js";

export const borrowItem = async (req, res) => {
    try {
        const { itemId, expectedReturnDate } = req.body;
        const borrowerId = req.user._id;

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (!item.isAvailable) {
            return res.status(400).json({ message: "Item is not available for borrowing" });
        }

        if (item.owner.toString() === borrowerId.toString()) {
            return res.status(400).json({ message: "You cannot borrow your own item" });
        }

        const activeLeases = await BorrowRecord.countDocuments({
            item: itemId,
            status: { $in: ["Pending", "Approved", "Borrowed"] }
        });

        if (activeLeases > 0) {
            return res.status(400).json({ message: "Item is already borrowed or has pending request" });
        }

        const lease = await BorrowRecord.create({
            item: itemId,
            borrower: borrowerId,
            lender: item.owner,
            expectedReturnDate
        });

        item.status = "Reserved";
        await item.save();

        await lease.populate([
            { path: "item", select: "title images transactionType price" },
            { path: "borrower", select: "name collegeEmail hostelBlock" },
            { path: "lender", select: "name collegeEmail hostelBlock" }
        ]);

        res.status(201).json(lease);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const returnItem = async (req, res) => {
    try {
        const lease = await BorrowRecord.findById(req.params.id);

        if (!lease) {
            return res.status(404).json({ message: "Lease record not found" });
        }

        if (lease.borrower.toString() !== req.user._id.toString() && lease.lender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this lease" });
        }

        lease.status = "Returned";
        lease.actualReturnDate = new Date();
        await lease.save();

        const item = await Item.findById(lease.item);
        if (item) {
            item.status = "Available";
            item.isAvailable = true;
            await item.save();
        }

        await lease.populate([
            { path: "item", select: "title images" },
            { path: "borrower", select: "name collegeEmail" },
            { path: "lender", select: "name collegeEmail" }
        ]);

        res.status(200).json(lease);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const requestExtension = async (req, res) => {
    try {
        const { extensionDays } = req.body;
        const lease = await BorrowRecord.findById(req.params.id);

        if (!lease) {
            return res.status(404).json({ message: "Lease record not found" });
        }

        if (lease.borrower.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only borrower can request extension" });
        }

        if (lease.status !== "Borrowed") {
            return res.status(400).json({ message: "Only active leases can be extended" });
        }

        if (lease.extensionRequested) {
            return res.status(400).json({ message: "Extension already requested" });
        }

        lease.extensionRequested = true;
        lease.extensionRequestDate = new Date();
        lease.extensionDays = Number(extensionDays);
        lease.status = "Extension Requested";
        await lease.save();

        await lease.populate([
            { path: "item", select: "title images" },
            { path: "borrower", select: "name collegeEmail" },
            { path: "lender", select: "name collegeEmail" }
        ]);

        res.status(200).json(lease);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const approveExtension = async (req, res) => {
    try {
        const lease = await BorrowRecord.findById(req.params.id);

        if (!lease) {
            return res.status(404).json({ message: "Lease record not found" });
        }

        if (lease.lender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only lender can approve extension" });
        }

        if (lease.status !== "Extension Requested") {
            return res.status(400).json({ message: "No extension request pending" });
        }

        const extensionDays = lease.extensionDays || 7;
        lease.expectedReturnDate = new Date(
            new Date(lease.expectedReturnDate).getTime() + extensionDays * 24 * 60 * 60 * 1000
        );

        lease.status = "Borrowed";
        lease.extensionRequested = false;
        lease.extensionRequestDate = undefined;
        lease.extensionDays = undefined;

        await lease.save();

        await lease.populate([
            { path: "item", select: "title images" },
            { path: "borrower", select: "name collegeEmail" },
            { path: "lender", select: "name collegeEmail" }
        ]);

        res.status(200).json(lease);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const rejectExtension = async (req, res) => {
    try {
        const lease = await BorrowRecord.findById(req.params.id);

        if (!lease) {
            return res.status(404).json({ message: "Lease record not found" });
        }

        if (lease.lender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only lender can reject extension" });
        }

        if (lease.status !== "Extension Requested") {
            return res.status(400).json({ message: "No extension request pending" });
        }

        lease.status = "Borrowed";
        lease.extensionRequested = false;
        lease.extensionRequestDate = undefined;
        lease.extensionDays = undefined;

        await lease.save();

        await lease.populate([
            { path: "item", select: "title images" },
            { path: "borrower", select: "name collegeEmail" },
            { path: "lender", select: "name collegeEmail" }
        ]);

        res.status(200).json(lease);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getMyLeases = async (req, res) => {
    try {
        const borrowerLeases = await BorrowRecord.find({ borrower: req.user._id })
            .populate("item", "title images transactionType")
            .populate("lender", "name collegeEmail hostelBlock")
            .sort({ createdAt: -1 });

        const lenderLeases = await BorrowRecord.find({ lender: req.user._id })
            .populate("item", "title images transactionType")
            .populate("borrower", "name collegeEmail hostelBlock")
            .sort({ createdAt: -1 });

        res.status(200).json({
            borrowed: borrowerLeases,
            lent: lenderLeases
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getLeaseById = async (req, res) => {
    try {
        const lease = await BorrowRecord.findById(req.params.id).populate([
            { path: "item", select: "title images category condition" },
            { path: "borrower", select: "name collegeEmail hostelBlock roomNumber" },
            { path: "lender", select: "name collegeEmail hostelBlock roomNumber" }
        ]);

        if (!lease) {
            return res.status(404).json({ message: "Lease record not found" });
        }

        const now = new Date();
        const returnDate = new Date(lease.expectedReturnDate);
        const remainingMs = returnDate - now;

        const countdown =
            lease.status === "Returned"
                ? null
                : {
                      days: Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60 * 24))),
                      hours: Math.max(0, Math.floor((remainingMs / (1000 * 60 * 60)) % 24)),
                      minutes: Math.max(0, Math.floor((remainingMs / (1000 * 60)) % 60)),
                      seconds: Math.max(0, Math.floor((remainingMs / 1000) % 60)),
                      overdue: remainingMs < 0 && lease.status !== "Returned"
                  };

        res.status(200).json({ ...lease.toObject(), countdown });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const markOverdue = async (req, res) => {
    try {
        const lease = await BorrowRecord.findById(req.params.id);

        if (!lease) {
            return res.status(404).json({ message: "Lease record not found" });
        }

        if (lease.status === "Borrowed" && new Date() > new Date(lease.expectedReturnDate)) {
            lease.status = "Overdue";
            await lease.save();
        }

        await lease.populate([
            { path: "item", select: "title images" },
            { path: "borrower", select: "name collegeEmail" },
            { path: "lender", select: "name collegeEmail" }
        ]);

        res.status(200).json(lease);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
