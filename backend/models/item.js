import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Books", "Electronics", "Bedding", "Furniture", "Others"],
    },

    condition: {
      type: String,
      required: true,
      enum: ["Like New", "Gently Used", "Heavy Wear"],
    },

    transactionType: {
      type: String,
      required: true,
      enum: ["Borrow", "Lease", "Sale"],
    },

    price: {
      type: Number,
      default: 0,
    },

    images: [
      {
        type: String,
      },
    ],

    hostelBlock: {
    type: String,
    required: true,
    enum: ["A Block", "B Block", "C Block", "D Block"],
    },

    status: {
        type: String,
        enum: ["Available", "Reserved", "Borrowed"],
        default: "Available",
    },

    isAvailable: {
        type: Boolean,
        default: true
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Item", itemSchema);