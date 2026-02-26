import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import { Banner } from "./src/models/Banner.js";
import { Category } from "./src/models/Category.js";
import { Product } from "./src/models/Product.js";
import { User } from "./src/models/User.js";

dotenv.config();

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    icon: "https://cdn.yoursite.com/icons/electronics.png",
    image: "https://cdn.yoursite.com/categories/electronics-banner.jpg",
    description: "Latest gadgets and electronics",
  },
  {
    name: "Fashion",
    slug: "fashion",
    icon: "https://cdn.yoursite.com/icons/fashion.png",
    image: "https://cdn.yoursite.com/categories/fashion-banner.jpg",
    description: "Trending fashion and clothing",
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    icon: "https://cdn.yoursite.com/icons/home.png",
    image: "https://cdn.yoursite.com/categories/home-banner.jpg",
    description: "Essentials for your home",
  },
];

const products = [
  {
    name: "iPhone 15 Pro",
    slug: "iphone-15-pro",
    description: "Latest Apple iPhone 15 Pro with A17 chip",
    brand: "Apple",
    price: 1299,
    discountPercentage: 5,
    finalPrice: 1234,
    stock: 25,
    sku: "APL-IP15P-001",
    categorySlug: "electronics",
    thumbnail: "https://cdn.yoursite.com/products/iphone15-thumb.jpg",
    images: [
      "https://cdn.yoursite.com/products/iphone15-1.jpg",
      "https://cdn.yoursite.com/products/iphone15-2.jpg",
    ],
    icon: "https://cdn.yoursite.com/icons/iphone-icon.png",
    tags: ["smartphone", "apple", "mobile"],
    ratingsAverage: 4.8,
    ratingsCount: 120,
    isActive: true,
    salesCount: 200,
  },
  {
    name: "Nike Air Max",
    slug: "nike-air-max",
    description: "Comfortable and stylish sports shoes",
    brand: "Nike",
    price: 199,
    discountPercentage: 10,
    finalPrice: 179,
    stock: 40,
    sku: "NK-AMX-002",
    categorySlug: "fashion",
    thumbnail: "https://cdn.yoursite.com/products/nike-thumb.jpg",
    images: [
      "https://cdn.yoursite.com/products/nike-1.jpg",
      "https://cdn.yoursite.com/products/nike-2.jpg",
    ],
    icon: "https://cdn.yoursite.com/icons/shoe-icon.png",
    tags: ["shoes", "sports"],
    ratingsAverage: 4.5,
    ratingsCount: 85,
    isActive: true,
    salesCount: 130,
  },
  {
    name: "Aero Headphones",
    slug: "aero-headphones",
    description: "Premium over-ear audio experience",
    brand: "Aero",
    price: 139,
    discountPercentage: 0,
    finalPrice: 139,
    stock: 12,
    sku: "AER-HDP-003",
    categorySlug: "electronics",
    thumbnail: "https://cdn.yoursite.com/products/headphone-thumb.jpg",
    images: ["https://cdn.yoursite.com/products/headphone-1.jpg"],
    icon: "https://cdn.yoursite.com/icons/headphone-icon.png",
    tags: ["audio", "headphones"],
    ratingsAverage: 4.7,
    ratingsCount: 210,
    isActive: true,
    salesCount: 300,
  },
  {
    name: "Cloud Mug",
    slug: "cloud-mug",
    description: "Ceramic mug for everyday use",
    brand: "Cloud",
    price: 27,
    discountPercentage: 0,
    finalPrice: 27,
    stock: 51,
    sku: "CLD-MUG-004",
    categorySlug: "home-kitchen",
    thumbnail: "https://cdn.yoursite.com/products/mug-thumb.jpg",
    images: ["https://cdn.yoursite.com/products/mug-1.jpg"],
    icon: "https://cdn.yoursite.com/icons/mug-icon.png",
    tags: ["mug", "kitchen"],
    ratingsAverage: 4.3,
    ratingsCount: 66,
    isActive: true,
    salesCount: 95,
  },
];

const homeBanners = [
  {
    title: "Mega Electronics Sale",
    subtitle: "Up to 50% OFF",
    image: "https://cdn.yoursite.com/banners/electronics-sale.jpg",
    link: "/category/electronics",
    type: "hero",
  },
  {
    title: "Fashion Week Deals",
    subtitle: "Trendy Styles 30% OFF",
    image: "https://cdn.yoursite.com/banners/fashion-sale.jpg",
    link: "/category/fashion",
    type: "promo",
  },
];

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    isVerified: true,
  },
  {
    name: "Varshini Customer",
    email: "customer1@example.com",
    role: "customer",
    isVerified: true,
  },
  {
    name: "Test Customer",
    email: "customer2@example.com",
    role: "customer",
    isVerified: true,
  },
];

const seed = async () => {
  await connectDB(process.env.MONGO_URI);

  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    Banner.deleteMany({}),
    User.deleteMany({}),
  ]);

  const hashedPassword = await bcrypt.hash("Password@123", 10);
  const seededUsers = users.map((user) => ({ ...user, password: hashedPassword }));

  await Promise.all([
    Category.insertMany(categories),
    Product.insertMany(products),
    Banner.insertMany(homeBanners),
    User.insertMany(seededUsers),
  ]);

  process.stdout.write("Seed completed successfully\n");
  process.exit(0);
};

seed().catch((error) => {
  process.stderr.write(`Seed failed: ${error.message}\n`);
  process.exit(1);
});
