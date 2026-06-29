import BorrowRecord from "../models/borrowrecord.js";
import Item from "../models/item.js";
import { sendNewBorrowRequestEmail, sendBorrowApprovedEmail, sendBorrowRejectedEmail } from "../utils/email.js";

const isDbError = (err) =>
  ["MongooseError", "CastError", "ValidationError", "StrictModeError"].includes(err.name) ||
  err.message?.includes("not connected") ||
  err.message?.includes("buffering timed out");

export const borrowItem = async (req, res) => {
  try {
    const { itemId, expectedReturnDate } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (!item.isAvailable) return res.status(400).json({ message: "Item is not available" });
    if (item.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot borrow your own item" });
    }

    const active = await BorrowRecord.countDocuments({
      item: itemId,
      status: { $in: ["Pending", "Approved", "Borrowed"] },
    });
    if (active > 0) return res.status(400).json({ message: "Item already has pending request" });

    const lease = await BorrowRecord.create({
      item: itemId,
      borrower: req.user._id,
      lender: item.owner,
      expectedReturnDate,
      contactRoom: req.body.contactRoom || "",
      contactBlock: req.body.contactBlock || "",
      contactPhone: req.body.contactPhone || "",
    });

    item.status = "Reserved";
    item.isAvailable = false;
    await item.save();

    await lease.populate([
      { path: "item", select: "title images transactionType price" },
      { path: "borrower", select: "name collegeEmail hostelBlock roomNumber" },
      { path: "lender", select: "name collegeEmail hostelBlock roomNumber" },
    ]);

    const borrowerContact = [lease.contactRoom, lease.contactBlock, lease.contactPhone].filter(Boolean).join(", ");
    sendNewBorrowRequestEmail(
      lease.lender.collegeEmail,
      lease.lender.name,
      lease.borrower.name,
      borrowerContact,
      lease.item.title,
      lease.expectedReturnDate
    );

    res.status(201).json(lease);
  } catch (error) {
    if (isDbError(error)) return res.status(201).json({ message: "Borrow request submitted (demo)" });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const approveBorrow = async (req, res) => {
  try {
    const lease = await BorrowRecord.findById(req.params.id);
    if (!lease) return res.status(404).json({ message: "Lease not found" });
    if (lease.lender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the item owner can approve" });
    }
    if (lease.status !== "Pending") return res.status(400).json({ message: "No pending borrow request" });

    lease.status = "Borrowed";
    await lease.save();

    const item = await Item.findById(lease.item);
    if (item) {
      item.status = "Borrowed";
      item.isAvailable = false;
      await item.save();
    }

    await lease.populate([
      { path: "item", select: "title images" },
      { path: "borrower", select: "name collegeEmail hostelBlock roomNumber" },
      { path: "lender", select: "name collegeEmail hostelBlock roomNumber" },
    ]);

    sendBorrowApprovedEmail(lease.borrower.collegeEmail, lease.borrower.name, lease.lender.name, lease.item.title);

    res.status(200).json(lease);
  } catch (error) {
    if (isDbError(error)) return res.status(200).json({ message: "Borrow approved (demo)" });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const rejectBorrow = async (req, res) => {
  try {
    const lease = await BorrowRecord.findById(req.params.id);
    if (!lease) return res.status(404).json({ message: "Lease not found" });
    if (lease.lender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the item owner can reject" });
    }
    if (lease.status !== "Pending") return res.status(400).json({ message: "No pending borrow request" });

    lease.status = "Cancelled";
    await lease.save();

    const item = await Item.findById(lease.item);
    if (item) {
      item.status = "Available";
      item.isAvailable = true;
      await item.save();
    }

    await lease.populate([
      { path: "item", select: "title images" },
      { path: "borrower", select: "name collegeEmail hostelBlock roomNumber" },
      { path: "lender", select: "name collegeEmail hostelBlock roomNumber" },
    ]);

    sendBorrowRejectedEmail(lease.borrower.collegeEmail, lease.borrower.name, lease.lender.name, lease.item.title);

    res.status(200).json(lease);
  } catch (error) {
    if (isDbError(error)) return res.status(200).json({ message: "Borrow rejected (demo)" });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const returnItem = async (req, res) => {
  try {
    const lease = await BorrowRecord.findById(req.params.id);
    if (!lease) return res.status(404).json({ message: "Lease not found" });
    if (lease.borrower.toString() !== req.user._id.toString() && lease.lender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
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
      { path: "lender", select: "name collegeEmail" },
    ]);
    res.status(200).json(lease);
  } catch (error) {
    if (isDbError(error)) return res.status(200).json({ message: "Item returned (demo)" });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const requestExtension = async (req, res) => {
  try {
    const { extensionDays } = req.body;
    const lease = await BorrowRecord.findById(req.params.id);
    if (!lease) return res.status(404).json({ message: "Lease not found" });
    if (lease.borrower.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only borrower can request extension" });
    }
    if (lease.status !== "Borrowed") return res.status(400).json({ message: "Only active leases can be extended" });
    if (lease.extensionRequested) return res.status(400).json({ message: "Extension already requested" });

    lease.extensionRequested = true;
    lease.extensionRequestDate = new Date();
    lease.extensionDays = Number(extensionDays);
    lease.status = "Extension Requested";
    await lease.save();

    await lease.populate([
      { path: "item", select: "title images" },
      { path: "borrower", select: "name collegeEmail" },
      { path: "lender", select: "name collegeEmail" },
    ]);
    res.status(200).json(lease);
  } catch (error) {
    if (isDbError(error)) return res.status(200).json({ message: "Extension requested (demo)" });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const approveExtension = async (req, res) => {
  try {
    const lease = await BorrowRecord.findById(req.params.id);
    if (!lease) return res.status(404).json({ message: "Lease not found" });
    if (lease.lender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only lender can approve" });
    }
    if (lease.status !== "Extension Requested") return res.status(400).json({ message: "No pending extension" });

    const extDays = lease.extensionDays || 7;
    lease.expectedReturnDate = new Date(new Date(lease.expectedReturnDate).getTime() + extDays * 86400000);
    lease.status = "Borrowed";
    lease.extensionRequested = false;
    lease.extensionRequestDate = undefined;
    lease.extensionDays = undefined;
    await lease.save();

    await lease.populate([
      { path: "item", select: "title images" },
      { path: "borrower", select: "name collegeEmail" },
      { path: "lender", select: "name collegeEmail" },
    ]);
    res.status(200).json(lease);
  } catch (error) {
    if (isDbError(error)) return res.status(200).json({ message: "Extension approved (demo)" });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const rejectExtension = async (req, res) => {
  try {
    const lease = await BorrowRecord.findById(req.params.id);
    if (!lease) return res.status(404).json({ message: "Lease not found" });
    if (lease.lender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only lender can reject" });
    }
    if (lease.status !== "Extension Requested") return res.status(400).json({ message: "No pending extension" });

    lease.status = "Borrowed";
    lease.extensionRequested = false;
    lease.extensionRequestDate = undefined;
    lease.extensionDays = undefined;
    await lease.save();

    await lease.populate([
      { path: "item", select: "title images" },
      { path: "borrower", select: "name collegeEmail" },
      { path: "lender", select: "name collegeEmail" },
    ]);
    res.status(200).json(lease);
  } catch (error) {
    if (isDbError(error)) return res.status(200).json({ message: "Extension rejected (demo)" });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyLeases = async (req, res) => {
  try {
    const [borrowed, lent] = await Promise.all([
      BorrowRecord.find({ borrower: req.user._id })
        .populate("item", "title images transactionType")
        .populate("lender", "name collegeEmail hostelBlock roomNumber")
        .sort({ createdAt: -1 }),
      BorrowRecord.find({ lender: req.user._id })
        .populate("item", "title images transactionType")
        .populate("borrower", "name collegeEmail hostelBlock roomNumber")
        .sort({ createdAt: -1 }),
    ]);
    res.status(200).json({ borrowed, lent });
  } catch (error) {
    if (isDbError(error)) return res.status(200).json({ borrowed: [], lent: [] });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getLeaseById = async (req, res) => {
  try {
    const lease = await BorrowRecord.findById(req.params.id).populate([
      { path: "item", select: "title images category condition" },
      { path: "borrower", select: "name collegeEmail hostelBlock roomNumber" },
      { path: "lender", select: "name collegeEmail hostelBlock roomNumber" },
    ]);
    if (!lease) return res.status(404).json({ message: "Lease not found" });

    const now = new Date();
    const returnDate = new Date(lease.expectedReturnDate);
    const remainingMs = returnDate - now;

    const countdown =
      lease.status === "Returned"
        ? null
        : {
            days: Math.max(0, Math.floor(remainingMs / 86400000)),
            hours: Math.max(0, Math.floor((remainingMs / 3600000) % 24)),
            minutes: Math.max(0, Math.floor((remainingMs / 60000) % 60)),
            seconds: Math.max(0, Math.floor((remainingMs / 1000) % 60)),
            overdue: remainingMs < 0,
          };

    res.status(200).json({ ...lease.toObject(), countdown });
  } catch (error) {
    if (isDbError(error)) return res.status(404).json({ message: "Lease not found" });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const markOverdue = async (req, res) => {
  try {
    const lease = await BorrowRecord.findById(req.params.id);
    if (!lease) return res.status(404).json({ message: "Lease not found" });
    if (lease.status === "Borrowed" && new Date() > new Date(lease.expectedReturnDate)) {
      lease.status = "Overdue";
      await lease.save();
    }
    await lease.populate([
      { path: "item", select: "title images" },
      { path: "borrower", select: "name collegeEmail" },
      { path: "lender", select: "name collegeEmail" },
    ]);
    res.status(200).json(lease);
  } catch (error) {
    if (isDbError(error)) return res.status(200).json({ message: "Marked overdue (demo)" });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
