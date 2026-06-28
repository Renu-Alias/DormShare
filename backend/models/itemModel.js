import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: [true, "Item name is required"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: ["Books", "Electronics", "Bedding", "Kitchen", "Other"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    condition: {
        type: String,
        required: [true, "Condition is required"],
        enum: ["Like New", "Gently Used", "Heavy Wear"]
    },
    transactionType: {
        type: String,
        required: [true, "Transaction type is required"],
        enum: ["Free to Borrow", "Available for Lease"]
    },
    price: {
        type: Number,
        default: 0,
        min: [0, "Price cannot be negative"]
    },
    lender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    images: [{
        type: String
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true
    }
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);
export default Item;
