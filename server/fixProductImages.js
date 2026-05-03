import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import { Product } from "./src/models/Product.js";

dotenv.config();

// Real Unsplash photos that actually match each product.
// `?w=900&q=80&auto=format&fit=crop` keeps file size sensible.
const param = "?w=900&q=80&auto=format&fit=crop";
const u = (id) => `https://images.unsplash.com/${id}${param}`;

const imageMap = {
  // ── Admin-seeded products (slug match) ───────────────────────
  "iphone-15-pro": {
    thumbnail: u("photo-1592899677977-9c10ca588bbd"),
    images: [
      u("photo-1592899677977-9c10ca588bbd"),
      u("photo-1605236453806-6ff36851218e"),
      u("photo-1556656793-08538906a9f8"),
    ],
  },
  "samsung-galaxy-s24-ultra": {
    thumbnail: u("photo-1610945415295-d9bbf067e59c"),
    images: [
      u("photo-1610945415295-d9bbf067e59c"),
      u("photo-1565849904461-04a58ad377e0"),
    ],
  },
  "google-pixel-8": {
    thumbnail: u("photo-1598327105666-5b89351aff97"),
    images: [
      u("photo-1598327105666-5b89351aff97"),
      u("photo-1567581935884-3349723552ca"),
    ],
  },
  "oneplus-12": {
    thumbnail: u("photo-1601784551446-20c9e07cdbdb"),
    images: [
      u("photo-1601784551446-20c9e07cdbdb"),
      u("photo-1616348436168-de43ad0db179"),
    ],
  },
  "nike-air-max": {
    thumbnail: u("photo-1542291026-7eec264c27ff"),
    images: [
      u("photo-1542291026-7eec264c27ff"),
      u("photo-1600185365926-3a2ce3cdb9eb"),
    ],
  },
  "aero-headphones": {
    thumbnail: u("photo-1583394838336-acd977736f90"),
    images: [
      u("photo-1583394838336-acd977736f90"),
      u("photo-1546435770-a3e426bf472b"),
    ],
  },
  "cloud-mug": {
    thumbnail: u("photo-1514228742587-6b1558fcca3d"),
    images: [
      u("photo-1514228742587-6b1558fcca3d"),
      u("photo-1495474472287-4d71bcdd2085"),
    ],
  },

  // ── Vendor-seeded products ───────────────────────────────────
  "aurora-wireless-earbuds": {
    thumbnail: u("photo-1606220945770-b5b6c2c55bf1"),
    images: [
      u("photo-1606220945770-b5b6c2c55bf1"),
      u("photo-1590658268037-6bf12165a8df"),
    ],
  },
  "aurora-smart-charger-65w": {
    thumbnail: u("photo-1618410320928-25228d811631"),
    images: [u("photo-1618410320928-25228d811631")],
  },
  "aurora-lumen-lamp": {
    thumbnail: u("photo-1565636192335-bfb7e9d61b56"),
    images: [u("photo-1565636192335-bfb7e9d61b56")],
  },
  "bloom-linen-shirt": {
    thumbnail: u("photo-1602810318383-e386cc2a3ccf"),
    images: [
      u("photo-1602810318383-e386cc2a3ccf"),
      u("photo-1620799140408-edc6dcb6d633"),
    ],
  },
  "bloom-canvas-tote": {
    thumbnail: u("photo-1591561954557-26941169b49e"),
    images: [u("photo-1591561954557-26941169b49e")],
  },
  "hearth-cast-iron-skillet": {
    thumbnail: u("photo-1588767768570-4b2bdfd87889"),
    images: [u("photo-1588767768570-4b2bdfd87889")],
  },
  "hearth-bamboo-cutting-board": {
    thumbnail: u("photo-1614623074275-7e1f93b1cb7c"),
    images: [u("photo-1614623074275-7e1f93b1cb7c")],
  },

  // The vendor "coffee mug" demo product was already added via API
  "coffee-mug": {
    thumbnail: u("photo-1514228742587-6b1558fcca3d"),
    images: [u("photo-1514228742587-6b1558fcca3d")],
  },
};

const run = async () => {
  await connectDB(process.env.MONGO_URI);

  let updated = 0;
  let missing = 0;

  for (const [slug, fields] of Object.entries(imageMap)) {
    const result = await Product.updateOne(
      { slug },
      { $set: { thumbnail: fields.thumbnail, images: fields.images } },
    );
    if (result.matchedCount > 0) {
      updated += 1;
      process.stdout.write(`  ✓ ${slug}\n`);
    } else {
      missing += 1;
      process.stdout.write(`  · ${slug} (not found)\n`);
    }
  }

  process.stdout.write(`\nUpdated ${updated} product(s). Skipped ${missing} (not in DB).\n`);
  process.exit(0);
};

run().catch((error) => {
  process.stderr.write(`Image fix failed: ${error.message}\n`);
  process.exit(1);
});
