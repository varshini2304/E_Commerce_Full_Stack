import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false },
    businessName: { type: String, required: true, trim: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Vendor = mongoose.model("Vendor", vendorSchema);
