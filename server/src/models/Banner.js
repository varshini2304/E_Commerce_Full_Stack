import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    image: { type: String, required: true },
    link: { type: String, required: true },
    type: { type: String, enum: ["hero", "promo"], required: true, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export const Banner = mongoose.model("Banner", bannerSchema);
