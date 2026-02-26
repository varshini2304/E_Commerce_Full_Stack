import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    brand: { type: String, default: "" },
    price: { type: Number, required: true, min: 0, index: true },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    finalPrice: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    sku: { type: String, required: true, unique: true, index: true },
    categorySlug: { type: String, required: true, index: true },
    thumbnail: { type: String, required: true },
    images: [{ type: String }],
    icon: { type: String, default: "" },
    tags: [{ type: String, index: true }],
    ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingsCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
    views: { type: Number, default: 0, min: 0 },
    salesCount: { type: Number, default: 0, min: 0, index: true },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);
