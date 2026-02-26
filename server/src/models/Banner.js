import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, required: true },
    mobileImage: { type: String, default: "" },
    icon: { type: String, default: "" },
    link: { type: String, required: true },
    type: {
      type: String,
      enum: ["hero", "promo", "category", "offer", "app"],
      required: true,
      index: true,
    },
    position: { type: Number, default: 1, index: true },
    isActive: { type: Boolean, default: true, index: true },
    startDate: { type: Date, default: null, index: true },
    endDate: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

bannerSchema.index({ type: 1, isActive: 1, position: 1 });

export const Banner = mongoose.model("Banner", bannerSchema);
