import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { ApiError } from "../utils/ApiError.js";

export const listProducts = async (query) => {
  const page = query.page || 1;
  const limit = query.limit || 12;
  const skip = (page - 1) * limit;

  const filter = { isActive: true };
  if (query.category) filter.categorySlug = query.category;
  if (query.minPrice || query.maxPrice) {
    filter.finalPrice = {};
    if (query.minPrice) filter.finalPrice.$gte = query.minPrice;
    if (query.maxPrice) filter.finalPrice.$lte = query.maxPrice;
  }
  if (query.rating) filter.ratingsAverage = { $gte: query.rating };
  if (query.search) filter.name = { $regex: query.search, $options: "i" };

  const sortMap = {
    price_asc: { finalPrice: 1 },
    price_desc: { finalPrice: -1 },
    newest: { createdAt: -1 },
    rating_desc: { ratingsAverage: -1 },
  };

  const sort = sortMap[query.sort] || { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug, isActive: true }).lean();
  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  const [reviews, relatedProducts] = await Promise.all([
    Review.find({ productId: product._id }).sort({ createdAt: -1 }).limit(10).lean(),
    Product.find({
      isActive: true,
      categorySlug: product.categorySlug,
      _id: { $ne: product._id },
    })
      .limit(4)
      .lean(),
  ]);

  await Product.updateOne({ _id: product._id }, { $inc: { views: 1 } });

  return { product: { ...product, reviews }, relatedProducts };
};

export const createProduct = async (payload) => {
  const existing = await Product.findOne({ sku: payload.sku }).lean();
  if (existing) {
    throw new ApiError("SKU already exists", 409);
  }

  const product = await Product.create(payload);
  return product.toObject();
};

export const updateProduct = async (id, payload) => {
  const product = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  return product;
};

export const updateProductStock = async (id, stock) => {
  const product = await Product.findByIdAndUpdate(id, { stock }, { new: true }).lean();
  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  return product;
};
