import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import { Banner } from "./src/models/Banner.js";
import { Category } from "./src/models/Category.js";
import { Order } from "./src/models/Order.js";
import { Product } from "./src/models/Product.js";
import { User } from "./src/models/User.js";

dotenv.config();

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    icon: "https://placehold.co/128x128/1f4690/ffffff?text=Electronics",
    image: "https://picsum.photos/seed/category-electronics/1200/700",
    description: "Latest gadgets and electronics",
  },
  {
    name: "Fashion",
    slug: "fashion",
    icon: "https://placehold.co/128x128/f47f74/ffffff?text=Fashion",
    image: "https://picsum.photos/seed/category-fashion/1200/700",
    description: "Trending fashion and clothing",
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    icon: "https://placehold.co/128x128/6e7bb6/ffffff?text=Home",
    image: "https://picsum.photos/seed/category-home-kitchen/1200/700",
    description: "Essentials for your home",
  },
  {
    name: "Sports & Outdoors",
    slug: "sports",
    icon: "https://placehold.co/128x128/24a148/ffffff?text=Sports",
    image: "https://picsum.photos/seed/category-sports/1200/700",
    description: "Gear and equipment for every adventure",
  },
  {
    name: "Books & Media",
    slug: "books",
    icon: "https://placehold.co/128x128/6e1f6a/ffffff?text=Books",
    image: "https://picsum.photos/seed/category-books/1200/700",
    description: "Read more with our curated collection",
  },
  {
    name: "Health & Beauty",
    slug: "beauty",
    icon: "https://placehold.co/128x128/ff6f61/ffffff?text=Beauty",
    image: "https://picsum.photos/seed/category-beauty/1200/700",
    description: "Wellness and personal care products",
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
    thumbnail: "https://picsum.photos/seed/product-iphone15-thumb/900/900",
    images: [
      "https://picsum.photos/seed/product-iphone15-1/1400/1000",
      "https://picsum.photos/seed/product-iphone15-2/1400/1000",
    ],
    icon: "https://placehold.co/128x128/242b5e/ffffff?text=Phone",
    tags: ["smartphone", "apple", "mobile"],
    ratingsAverage: 4.8,
    ratingsCount: 120,
    isActive: true,
    salesCount: 200,
  },
  {
  "_id": "69a559280e62f609fffae9b6",
  "name": "Samsung Galaxy S24 Ultra",
  "slug": "samsung-galaxy-s24-ultra",
  "description": "Flagship Samsung Galaxy S24 Ultra with Snapdragon 8 Gen 3",
  "brand": "Samsung",
  "price": 1199,
  "discountPercentage": 10,
  "finalPrice": 1079,
  "stock": 30,
  "sku": "SMS-S24U-002",
  "categorySlug": "electronics",
  "thumbnail": "https://picsum.photos/seed/product-samsung-thumb/900/900",
  "images": [
    "https://picsum.photos/seed/product-samsung-1/900/900",
    "https://picsum.photos/seed/product-samsung-2/900/900"
  ],
  "icon": "https://placehold.co/128x128/242b5e/ffffff?text=Phone",
  "tags": ["smartphone", "android", "mobile"],
  "ratingsAverage": 4.7,
  "ratingsCount": 98,
  "isActive": true,
  "views": 0,
  "salesCount": 150,
  "__v": 0,
  "createdAt": "2026-03-02T09:35:10.123+00:00",
  "updatedAt": "2026-03-02T09:35:10.123+00:00"
},
{
  "_id": "69a559280e62f609fffae9b7",
  "name": "Google Pixel 8",
  "slug": "google-pixel-8",
  "description": "Google Pixel 8 with Tensor G3 chip and pure Android experience",
  "brand": "Google",
  "price": 899,
  "discountPercentage": 8,
  "finalPrice": 827,
  "stock": 40,
  "sku": "GGL-PX8-003",
  "categorySlug": "electronics",
  "thumbnail": "https://picsum.photos/seed/product-pixel-thumb/900/900",
  "images": [
    "https://picsum.photos/seed/product-pixel-1/900/900",
    "https://picsum.photos/seed/product-pixel-2/900/900"
  ],
  "icon": "https://placehold.co/128x128/242b5e/ffffff?text=Phone",
  "tags": ["smartphone", "android", "mobile"],
  "ratingsAverage": 4.5,
  "ratingsCount": 76,
  "isActive": true,
  "views": 0,
  "salesCount": 90,
  "__v": 0,
  "createdAt": "2026-03-02T09:40:05.001+00:00",
  "updatedAt": "2026-03-02T09:40:05.001+00:00"
},
{
  "_id": "69a559280e62f609fffae9b8",
  "name": "OnePlus 12",
  "slug": "oneplus-12",
  "description": "OnePlus 12 with 200 MP camera and 120 Hz display",
  "brand": "OnePlus",
  "price": 799,
  "discountPercentage": 12,
  "finalPrice": 703,
  "stock": 55,
  "sku": "OPL-12-004",
  "categorySlug": "electronics",
  "thumbnail": "https://picsum.photos/seed/product-oplus-thumb/900/900",
  "images": [
    "https://picsum.photos/seed/product-oplus-1/900/900",
    "https://picsum.photos/seed/product-oplus-2/900/900"
  ],
  "icon": "https://placehold.co/128x128/242b5e/ffffff?text=Phone",
  "tags": ["smartphone", "android", "mobile"],
  "ratingsAverage": 4.6,
  "ratingsCount": 83,
  "isActive": true,
  "views": 0,
  "salesCount": 110,
  "__v": 0,
  "createdAt": "2026-03-02T09:45:20.456+00:00",
  "updatedAt": "2026-03-02T09:45:20.456+00:00"
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
    thumbnail: "https://picsum.photos/seed/product-nike-thumb/900/900",
    images: [
      "https://picsum.photos/seed/product-nike-1/1400/1000",
      "https://picsum.photos/seed/product-nike-2/1400/1000",
    ],
    icon: "https://placehold.co/128x128/161f46/ffffff?text=Shoes",
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
    thumbnail: "https://picsum.photos/seed/product-headphone-thumb/900/900",
    images: ["https://picsum.photos/seed/product-headphone-1/1400/1000"],
    icon: "https://placehold.co/128x128/33407a/ffffff?text=Audio",
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
    thumbnail: "https://picsum.photos/seed/product-mug-thumb/900/900",
    images: ["https://picsum.photos/seed/product-mug-1/1400/1000"],
    icon: "https://placehold.co/128x128/5174a4/ffffff?text=Mug",
    tags: ["mug", "kitchen"],
    ratingsAverage: 4.3,
    ratingsCount: 66,
    isActive: true,
    salesCount: 95,
  },
];

const heroBanners = [
  {
    title: "Mega Electronics Sale",
    subtitle: "Up to 50% OFF",
    description: "Grab the best gadgets at unbeatable prices.",
    image: "https://picsum.photos/seed/banner-hero-electronics/1600/700",
    mobileImage: "https://picsum.photos/seed/banner-hero-electronics-mobile/900/1200",
    icon: "https://placehold.co/128x128/f5a623/ffffff?text=Sale",
    link: "/category/electronics",
    type: "hero",
    position: 1,
    isActive: true,
  },
  {
    title: "Fashion Fest 2026",
    subtitle: "Flat 30% OFF",
    description: "Trending styles curated for you.",
    image: "https://picsum.photos/seed/banner-hero-fashion/1600/700",
    mobileImage: "https://picsum.photos/seed/banner-hero-fashion-mobile/900/1200",
    icon: "https://placehold.co/128x128/f47f74/ffffff?text=Style",
    link: "/category/fashion",
    type: "hero",
    position: 2,
    isActive: true,
  },
];

const promoBanners = [
  {
    title: "Smart Home Essentials",
    subtitle: "Upgrade Your Living",
    description: "Top-rated home appliances at special prices.",
    image: "https://picsum.photos/seed/banner-promo-home/1600/700",
    mobileImage: "https://picsum.photos/seed/banner-promo-home-mobile/900/1200",
    icon: "https://placehold.co/128x128/3f5b91/ffffff?text=Home",
    link: "/category/home-kitchen",
    type: "promo",
    position: 1,
    isActive: true,
  },
];

const categoryBanners = [
  {
    title: "Electronics Deals",
    subtitle: "New Arrivals Everyday",
    description: "Explore latest gadgets.",
    image: "https://picsum.photos/seed/banner-category-electronics/1600/700",
    mobileImage: "https://picsum.photos/seed/banner-category-electronics-mobile/900/1200",
    icon: "https://placehold.co/128x128/1f4690/ffffff?text=Tech",
    link: "/category/electronics",
    type: "category",
    position: 1,
    isActive: true,
  },
  {
    title: "Fashion Finds",
    subtitle: "Trending Styles",
    description: "Discover the latest fashion collections.",
    image: "https://picsum.photos/seed/banner-category-fashion/1600/700",
    mobileImage: "https://picsum.photos/seed/banner-category-fashion-mobile/900/1200",
    icon: "https://placehold.co/128x128/f47f74/ffffff?text=Style",
    link: "/category/fashion",
    type: "category",
    position: 2,
    isActive: true,
  },
  {
    title: "Home & Kitchen",
    subtitle: "Essentials for Every Home",
    description: "Upgrade your living space with our homeware.",
    image: "https://picsum.photos/seed/banner-category-home/1600/700",
    mobileImage: "https://picsum.photos/seed/banner-category-home-mobile/900/1200",
    icon: "https://placehold.co/128x128/6e7bb6/ffffff?text=Home",
    link: "/category/home-kitchen",
    type: "category",
    position: 3,
    isActive: true,
  },
  {
    title: "Sports Gear",
    subtitle: "Gear Up & Go",
    description: "Everything you need for your next adventure.",
    image: "https://picsum.photos/seed/banner-category-sports/1600/700",
    mobileImage: "https://picsum.photos/seed/banner-category-sports-mobile/900/1200",
    icon: "https://placehold.co/128x128/24a148/ffffff?text=Sports",
    link: "/category/sports",
    type: "category",
    position: 4,
    isActive: true,
  },
  {
    title: "Books & Media",
    subtitle: "Read, Learn, Enjoy",
    description: "Find your next great read or binge-worthy media.",
    image: "https://picsum.photos/seed/banner-category-books/1600/700",
    mobileImage: "https://picsum.photos/seed/banner-category-books-mobile/900/1200",
    icon: "https://placehold.co/128x128/6e1f6a/ffffff?text=Books",
    link: "/category/books",
    type: "category",
    position: 5,
    isActive: true,
  },
];

const offerBanners = [
  {
    title: "Weekend Special Offer",
    subtitle: "Extra 10% OFF",
    description: "Use code: WEEKEND10",
    image: "https://picsum.photos/seed/banner-offer-weekend/1600/700",
    mobileImage: "https://picsum.photos/seed/banner-offer-weekend-mobile/900/1200",
    icon: "https://placehold.co/128x128/d15a48/ffffff?text=Offer",
    link: "/offers",
    type: "offer",
    position: 1,
    isActive: true,
  },
];

const appBanners = [
  {
    title: "Download Our App",
    subtitle: "Shop Faster & Smarter",
    description: "Available on iOS & Android.",
    image: "https://picsum.photos/seed/banner-app-download/1600/700",
    mobileImage: "https://picsum.photos/seed/banner-app-download-mobile/900/1200",
    icon: "https://placehold.co/128x128/4a63b4/ffffff?text=App",
    link: "/download-app",
    type: "app",
    position: 1,
    isActive: true,
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
    Order.deleteMany({}),
  ]);

  const hashedPassword = await bcrypt.hash("Password@123", 10);
  const seededUsers = users.map((user) => ({ ...user, password: hashedPassword }));
  const banners = [
    ...heroBanners,
    ...promoBanners,
    ...categoryBanners,
    ...offerBanners,
    ...appBanners,
  ];

  const [seededCategories, seededProducts, seededBanners, insertedUsers] = await Promise.all([
    Category.insertMany(categories),
    Product.insertMany(products),
    Banner.insertMany(banners),
    User.insertMany(seededUsers),
  ]);

  void seededCategories;
  void seededBanners;

  const customer = insertedUsers.find((user) => user.role === "customer");

  if (customer && seededProducts.length >= 3) {
    const [productA, productB, productC] = seededProducts;
    const seededOrders = [
      {
        userId: customer._id,
        items: [
          {
            productId: productA._id,
            name: productA.name,
            thumbnail: productA.thumbnail,
            quantity: 1,
            price: productA.finalPrice,
          },
          {
            productId: productB._id,
            name: productB.name,
            thumbnail: productB.thumbnail,
            quantity: 1,
            price: productB.finalPrice,
          },
        ],
        subtotal: productA.finalPrice + productB.finalPrice,
        total: productA.finalPrice + productB.finalPrice,
        status: "delivered",
        paymentStatus: "paid",
        isPaid: true,
      },
      {
        userId: customer._id,
        items: [
          {
            productId: productC._id,
            name: productC.name,
            thumbnail: productC.thumbnail,
            quantity: 1,
            price: productC.finalPrice,
          },
        ],
        subtotal: productC.finalPrice,
        total: productC.finalPrice,
        status: "processing",
        paymentStatus: "pending",
        isPaid: false,
      },
    ];

    await Order.insertMany(seededOrders);
  }

  process.stdout.write("Seed completed successfully\n");
  process.exit(0);
};

seed().catch((error) => {
  process.stderr.write(`Seed failed: ${error.message}\n`);
  process.exit(1);
});
