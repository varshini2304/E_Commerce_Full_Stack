import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    icon: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export const Category = mongoose.model("Category", categorySchema);
