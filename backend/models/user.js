import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    hostelBlock: {
      type: String,
      required: true,
      enum: [
        "A Block",
        "B Block",
        "C Block",
        "D Block"
      ],
    },

    roomNumber: {
      type: String,
    },

    profileImage: {
      type: String,
      default: "",
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);