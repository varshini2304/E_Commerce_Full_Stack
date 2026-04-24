import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { ApiError } from "../utils/ApiError.js";
import { getCache, invalidatePatterns, setCache } from "../utils/cache.js";

const PRODUCT_LIST_CACHE_PREFIX = "products:list:";
const PRODUCT_DETAILS_CACHE_PREFIX = "products:slug:";

const buildListCacheKey = (query, page, limit) => {
  const payload = {
    page,
    limit,
    category: query.category || "",
    minPrice: query.minPrice || "",
    maxPrice: query.maxPrice || "",
    rating: query.rating || "",
    search: query.search || "",
    sort: query.sort || "",
  };

  return `${PRODUCT_LIST_CACHE_PREFIX}${Buffer.from(JSON.stringify(payload)).toString("base64url")}`;
};

export const invalidateProductCaches = async () => {
  await invalidatePatterns([`${PRODUCT_LIST_CACHE_PREFIX}*`, `${PRODUCT_DETAILS_CACHE_PREFIX}*`, "home:data"]);
};

export const listProducts = async (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.max(Number.parseInt(query.limit, 10) || 12, 1);
  const skip = (page - 1) * limit;
  const cacheKey = buildListCacheKey(query, page, limit);

  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const filter = { isActive: true };
  if (query.category) filter.categorySlug = query.category;
  if (query.minPrice || query.maxPrice) {
    const minPrice = Number.parseFloat(query.minPrice);
    const maxPrice = Number.parseFloat(query.maxPrice);
    filter.finalPrice = {};
    if (Number.isFinite(minPrice)) filter.finalPrice.$gte = minPrice;
    if (Number.isFinite(maxPrice)) filter.finalPrice.$lte = maxPrice;
    if (Object.keys(filter.finalPrice).length === 0) delete filter.finalPrice;
  }
  if (query.rating) {
    const rating = Number.parseFloat(query.rating);
    if (Number.isFinite(rating)) {
      filter.ratingsAverage = { $gte: rating };
    }
  }
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

  const response = {
    products,
    total,
    page,
    pages: Math.ceil(total / limit),
  };

  await setCache(cacheKey, response, 60);
  return response;
};

export const getProductBySlug = async (slug) => {
  const cacheKey = `${PRODUCT_DETAILS_CACHE_PREFIX}${slug}`;
  const cached = await getCache(cacheKey);

  if (cached) {
    await Product.updateOne({ _id: cached.product._id }, { $inc: { views: 1 } });
    return cached;
  }

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

  const response = { product: { ...product, reviews }, relatedProducts };
  await setCache(cacheKey, response, 60);
  return response;
};

export const createProduct = async (payload) => {
  const existing = await Product.findOne({ sku: payload.sku }).lean();
  if (existing) {
    throw new ApiError("SKU already exists", 409);
  }

  const product = await Product.create(payload);
  await invalidateProductCaches();
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

  await invalidateProductCaches();
  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  await invalidateProductCaches();
  return product;
};

export const updateProductStock = async (id, stock) => {
  const product = await Product.findByIdAndUpdate(id, { stock }, { new: true }).lean();
  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  await invalidateProductCaches();
  return product;
};
