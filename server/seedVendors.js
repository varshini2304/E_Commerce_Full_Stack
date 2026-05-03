import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import { Vendor } from "./src/models/Vendor.js";
import { Product } from "./src/models/Product.js";

dotenv.config();

const VENDOR_PASSWORD = "Vendor@123";

const vendors = [
  {
    name: "Aarav Mehta",
    email: "vendor1@example.com",
    businessName: "Aurora Electronics",
    isVerified: true,
  },
  {
    name: "Priya Sharma",
    email: "vendor2@example.com",
    businessName: "Bloom Fashion Studio",
    isVerified: true,
  },
  {
    name: "Rohan Iyer",
    email: "vendor3@example.com",
    businessName: "Hearth & Home Goods",
    isVerified: false,
  },
];

const productsByVendorEmail = {
  "vendor1@example.com": [
    {
      name: "Aurora Wireless Earbuds",
      slug: "aurora-wireless-earbuds",
      description: "Active noise-cancelling earbuds with 30-hour total battery life.",
      brand: "Aurora",
      price: 149,
      discountPercentage: 10,
      finalPrice: 134,
      stock: 80,
      sku: "AUR-EB-001",
      categorySlug: "electronics",
      thumbnail: "https://picsum.photos/seed/vendor1-earbuds-thumb/900/900",
      images: [
        "https://picsum.photos/seed/vendor1-earbuds-1/1400/1000",
        "https://picsum.photos/seed/vendor1-earbuds-2/1400/1000",
      ],
      tags: ["audio", "earbuds", "wireless"],
      ratingsAverage: 4.6,
      ratingsCount: 142,
      isActive: true,
      salesCount: 320,
    },
    {
      name: "Aurora Smart Charger 65W",
      slug: "aurora-smart-charger-65w",
      description: "Compact GaN charger with USB-C PD and intelligent power sharing.",
      brand: "Aurora",
      price: 59,
      discountPercentage: 0,
      finalPrice: 59,
      stock: 5,
      sku: "AUR-CH-002",
      categorySlug: "electronics",
      thumbnail: "https://picsum.photos/seed/vendor1-charger-thumb/900/900",
      images: ["https://picsum.photos/seed/vendor1-charger-1/1400/1000"],
      tags: ["charger", "usb-c", "accessories"],
      ratingsAverage: 4.4,
      ratingsCount: 58,
      isActive: true,
      salesCount: 110,
    },
    {
      name: "Aurora Lumen Lamp",
      slug: "aurora-lumen-lamp",
      description: "Warm-white LED desk lamp with wireless charging base.",
      brand: "Aurora",
      price: 89,
      discountPercentage: 5,
      finalPrice: 84,
      stock: 22,
      sku: "AUR-LMP-003",
      categorySlug: "home-kitchen",
      thumbnail: "https://picsum.photos/seed/vendor1-lamp-thumb/900/900",
      images: ["https://picsum.photos/seed/vendor1-lamp-1/1400/1000"],
      tags: ["lighting", "desk", "smart-home"],
      ratingsAverage: 4.2,
      ratingsCount: 31,
      isActive: true,
      salesCount: 60,
    },
  ],
  "vendor2@example.com": [
    {
      name: "Bloom Linen Shirt",
      slug: "bloom-linen-shirt",
      description: "Breathable, ethically-sourced linen shirt with relaxed fit.",
      brand: "Bloom",
      price: 79,
      discountPercentage: 15,
      finalPrice: 67,
      stock: 60,
      sku: "BLM-LIN-001",
      categorySlug: "fashion",
      thumbnail: "https://picsum.photos/seed/vendor2-shirt-thumb/900/900",
      images: [
        "https://picsum.photos/seed/vendor2-shirt-1/1400/1000",
        "https://picsum.photos/seed/vendor2-shirt-2/1400/1000",
      ],
      tags: ["clothing", "shirt", "linen"],
      ratingsAverage: 4.5,
      ratingsCount: 87,
      isActive: true,
      salesCount: 175,
    },
    {
      name: "Bloom Canvas Tote",
      slug: "bloom-canvas-tote",
      description: "Heavy-cotton everyday tote with reinforced straps.",
      brand: "Bloom",
      price: 35,
      discountPercentage: 0,
      finalPrice: 35,
      stock: 8,
      sku: "BLM-TOT-002",
      categorySlug: "fashion",
      thumbnail: "https://picsum.photos/seed/vendor2-tote-thumb/900/900",
      images: ["https://picsum.photos/seed/vendor2-tote-1/1400/1000"],
      tags: ["bag", "tote", "accessories"],
      ratingsAverage: 4.3,
      ratingsCount: 44,
      isActive: true,
      salesCount: 90,
    },
  ],
  "vendor3@example.com": [
    {
      name: "Hearth Cast Iron Skillet",
      slug: "hearth-cast-iron-skillet",
      description: "Pre-seasoned 12-inch cast iron skillet, oven-safe to 500°F.",
      brand: "Hearth",
      price: 65,
      discountPercentage: 8,
      finalPrice: 60,
      stock: 35,
      sku: "HRT-SKI-001",
      categorySlug: "home-kitchen",
      thumbnail: "https://picsum.photos/seed/vendor3-skillet-thumb/900/900",
      images: ["https://picsum.photos/seed/vendor3-skillet-1/1400/1000"],
      tags: ["cookware", "kitchen", "cast-iron"],
      ratingsAverage: 4.8,
      ratingsCount: 215,
      isActive: true,
      salesCount: 410,
    },
    {
      name: "Hearth Bamboo Cutting Board",
      slug: "hearth-bamboo-cutting-board",
      description: "Sustainable bamboo cutting board with juice groove.",
      brand: "Hearth",
      price: 29,
      discountPercentage: 0,
      finalPrice: 29,
      stock: 0,
      sku: "HRT-BRD-002",
      categorySlug: "home-kitchen",
      thumbnail: "https://picsum.photos/seed/vendor3-board-thumb/900/900",
      images: ["https://picsum.photos/seed/vendor3-board-1/1400/1000"],
      tags: ["kitchen", "cutting-board", "bamboo"],
      ratingsAverage: 4.4,
      ratingsCount: 67,
      isActive: false,
      salesCount: 130,
    },
  ],
};

const seedVendors = async () => {
  await connectDB(process.env.MONGO_URI);

  const passwordHash = await bcrypt.hash(VENDOR_PASSWORD, 10);
  const summary = { vendorsCreated: 0, vendorsSkipped: 0, productsCreated: 0, productsSkipped: 0 };
  const vendorByEmail = {};

  // ── Vendors ─────────────────────────────────────────────────
  for (const v of vendors) {
    const existing = await Vendor.findOne({ email: v.email.toLowerCase() });
    if (existing) {
      vendorByEmail[v.email] = existing;
      summary.vendorsSkipped += 1;
      continue;
    }
    const created = await Vendor.create({
      ...v,
      email: v.email.toLowerCase(),
      password: passwordHash,
    });
    vendorByEmail[v.email] = created;
    summary.vendorsCreated += 1;
  }

  // ── Vendor-owned products ───────────────────────────────────
  for (const [email, productList] of Object.entries(productsByVendorEmail)) {
    const vendor = vendorByEmail[email];
    if (!vendor) continue;

    for (const p of productList) {
      const existing = await Product.findOne({ $or: [{ slug: p.slug }, { sku: p.sku }] });
      if (existing) {
        summary.productsSkipped += 1;
        continue;
      }
      await Product.create({ ...p, vendorId: vendor._id });
      summary.productsCreated += 1;
    }
  }

  process.stdout.write(
    `Vendor seed complete:\n` +
      `  vendors:  ${summary.vendorsCreated} created, ${summary.vendorsSkipped} skipped\n` +
      `  products: ${summary.productsCreated} created, ${summary.productsSkipped} skipped\n` +
      `\nDemo logins (password: ${VENDOR_PASSWORD}):\n` +
      vendors.map((v) => `  ${v.email}  —  ${v.businessName}`).join("\n") +
      "\n",
  );
  process.exit(0);
};

seedVendors().catch((error) => {
  process.stderr.write(`Vendor seed failed: ${error.message}\n`);
  process.exit(1);
});
