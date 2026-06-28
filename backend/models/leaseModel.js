import mongoose from "mongoose";

const leaseSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    lender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    expectedReturnDate: {
        type: Date,
        required: [true, "Expected return date is required"]
    },
    actualReturnDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ["Active", "Returned", "Overdue", "Extension Requested"],
        default: "Active"
    },
    extensionRequestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    extensionRequestDate: {
        type: Date
    }
}, { timestamps: true });

const Lease = mongoose.model("Lease", leaseSchema);
export default Lease;
