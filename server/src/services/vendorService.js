import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Vendor } from "../models/Vendor.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";

const JWT_TTL = "7d";

const toVendorDto = (vendor) => ({
  id: String(vendor._id),
  name: vendor.name,
  email: vendor.email,
  businessName: vendor.businessName,
  isVerified: vendor.isVerified,
  createdAt: vendor.createdAt,
});

const toProductDto = (product) => ({
  id: String(product._id),
  vendorId: product.vendorId ? String(product.vendorId) : "",
  name: product.name,
  slug: product.slug,
  description: product.description,
  brand: product.brand ?? "",
  price: product.price,
  discountPercentage: product.discountPercentage ?? 0,
  finalPrice: product.finalPrice,
  stock: product.stock,
  sku: product.sku,
  categorySlug: product.categorySlug,
  thumbnail: product.thumbnail,
  images: product.images ?? [],
  tags: product.tags ?? [],
  ratingsAverage: product.ratingsAverage ?? 0,
  ratingsCount: product.ratingsCount ?? 0,
  isActive: product.isActive,
  views: product.views ?? 0,
  salesCount: product.salesCount ?? 0,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const signToken = (vendorId) =>
  jwt.sign({ vendorId, type: "vendor" }, process.env.JWT_SECRET, { expiresIn: JWT_TTL });

export const registerVendor = async ({ name, email, password, businessName }) => {
  const existing = await Vendor.findOne({ email: email.toLowerCase() }).lean();
  if (existing) {
    throw new ApiError("A vendor with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const created = await Vendor.create({
    name,
    email: email.toLowerCase(),
    password: passwordHash,
    businessName,
  });

  return {
    token: signToken(String(created._id)),
    vendor: toVendorDto(created),
  };
};

export const loginVendor = async ({ email, password }) => {
  const vendor = await Vendor.findOne({ email: email.toLowerCase() }).select("+password");
  if (!vendor) {
    throw new ApiError("Invalid email or password", 401);
  }

  const matches = await bcrypt.compare(password, vendor.password);
  if (!matches) {
    throw new ApiError("Invalid email or password", 401);
  }

  return {
    token: signToken(String(vendor._id)),
    vendor: toVendorDto(vendor),
  };
};

export const getVendorProfile = async (vendorId) => {
  const vendor = await Vendor.findById(vendorId).lean();
  if (!vendor) throw new ApiError("Vendor not found", 404);
  return { vendor: toVendorDto(vendor) };
};

export const listVendorProducts = async (vendorId, { page = 1, limit = 20 } = {}) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));

  const filter = { vendorId };
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * safeLimit)
    .limit(safeLimit)
    .lean();

  return {
    products: products.map(toProductDto),
    total,
    page: safePage,
    pages: Math.max(1, Math.ceil(total / safeLimit)),
  };
};

export const createVendorProduct = async (vendorId, payload) => {
  const slugTaken = await Product.findOne({ slug: payload.slug }).lean();
  if (slugTaken) throw new ApiError("Product slug already exists", 409);

  const skuTaken = await Product.findOne({ sku: payload.sku }).lean();
  if (skuTaken) throw new ApiError("Product SKU already exists", 409);

  const created = await Product.create({
    ...payload,
    vendorId,
    isActive: true,
  });

  return toProductDto(created);
};

export const updateVendorProduct = async (vendorId, productId, payload) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);
  if (!product.vendorId || String(product.vendorId) !== String(vendorId)) {
    throw new ApiError("You do not own this product", 403);
  }

  Object.assign(product, payload);
  await product.save();
  return toProductDto(product.toObject());
};

export const deleteVendorProduct = async (vendorId, productId) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);
  if (!product.vendorId || String(product.vendorId) !== String(vendorId)) {
    throw new ApiError("You do not own this product", 403);
  }

  await product.deleteOne();
  return toProductDto(product.toObject());
};

export const getVendorInventory = async (vendorId) => {
  const products = await Product.find({ vendorId }).lean();
  return products.map((product) => ({
    id: String(product._id),
    productId: String(product._id),
    vendorId: String(product.vendorId),
    availableStock: product.stock ?? 0,
    reservedStock: 0,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }));
};
