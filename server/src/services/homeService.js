import { Banner } from "../models/Banner.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";

export const getHomePageData = async () => {
  const bannerFilter = buildActiveBannerFilter();

  const [
    heroBanners,
    promoBanners,
    categoryBanners,
    offerBanners,
    appBanners,
    categories,
    featuredProducts,
    trendingProducts,
  ] = await Promise.all([
    Banner.find({ ...bannerFilter, type: "hero" }).sort({ position: 1 }).lean(),
    Banner.find({ ...bannerFilter, type: "promo" }).sort({ position: 1 }).lean(),
    Banner.find({ ...bannerFilter, type: "category" }).sort({ position: 1 }).lean(),
    Banner.find({ ...bannerFilter, type: "offer" }).sort({ position: 1 }).lean(),
    Banner.find({ ...bannerFilter, type: "app" }).sort({ position: 1 }).lean(),
    Category.find({ isActive: true }).limit(8).lean(),
    Product.find({ isActive: true })
      .sort({ ratingsAverage: -1, salesCount: -1 })
      .limit(8)
      .lean(),
    Product.find({ isActive: true })
      .sort({ salesCount: -1, createdAt: -1 })
      .limit(8)
      .lean(),
  ]);

  const heroBanner = heroBanners[0] || null;
  const promoBanner = promoBanners[0] || null;

  return {
    navigation: {
      logoText: "E-Commerce",
      homeHref: "/",
      searchPlaceholder: "Search...",
      searchAction: "/search",
      actions: [
        { id: "wishlist", label: "Wishlist", href: "/wishlist", icon: "wishlist" },
        { id: "cart", label: "Cart", href: "/cart", icon: "cart", badgeCount: 0 },
        { id: "profile", label: "Profile", href: "/profile", icon: "profile" },
      ],
    },
    sectionHeaders: {
      categories: { title: "Shop by Category", subtitle: "Popular picks this week" },
      featuredProducts: { title: "Featured Products", ctaLabel: "Add to cart" },
      trendingProducts: { title: "Trending Products", ctaLabel: "Add to cart" },
      newsletter: {
        title: "Get 20% Off Your First Order",
        subtitle: "Sign up for updates and offers",
      },
    },
    hero: {
      eyebrow: heroBanner?.title || "Limited Offer",
      title: heroBanner?.subtitle || "Big Savings Today",
      subtitle: heroBanner?.description || "Discover exclusive offers and best-selling products.",
      imageUrl: heroBanner?.image || "",
      imageAlt: heroBanner?.title || "Hero banner",
      primaryAction: { label: "Shop Now", href: heroBanner?.link || "/products" },
    },
    categories: categories.map((category) => ({
      id: String(category._id),
      name: category.name,
      description: category.description,
      imageUrl: category.icon || category.image,
      icon: category.slug,
    })),
    featuredProducts: featuredProducts.map(mapProductForUI),
    trendingProducts: trendingProducts.map(mapProductForUI),
    promoBanner: {
      badge: promoBanner?.title || "Special Offer",
      title: promoBanner?.subtitle || "Save More on Every Order",
      description: promoBanner?.description || "Limited-time promo from our curated collection.",
      imageUrl: promoBanner?.image || "",
      imageAlt: promoBanner?.title || "Promo banner",
      action: { label: "Explore", href: promoBanner?.link || "/products" },
    },
    newsletter: {
      title: "Subscribe",
      description: "Get weekly deals straight to your inbox.",
      emailPlaceholder: "Enter your email",
      submitLabel: "Subscribe",
      actionUrl: "/api/newsletter/subscribe",
      method: "post",
      disclaimer: "You can unsubscribe any time.",
    },
    footer: {
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms & Conditions", href: "/terms" },
      ],
      socialLinks: [
        { id: "facebook", icon: "facebook", label: "Facebook", href: "#" },
        { id: "twitter", icon: "twitter", label: "Twitter", href: "#" },
        { id: "pinterest", icon: "pinterest", label: "Pinterest", href: "#" },
      ],
      copyrightText: "© 2026 E-Commerce. All rights reserved.",
    },
    heroBanners,
    promoBanners,
    categoryBanners,
    offerBanners,
    appBanners,
  };
};

const buildActiveBannerFilter = () => {
  const now = new Date();
  return {
    isActive: true,
    $and: [
      { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
    ],
  };
};

const mapProductForUI = (product) => ({
  id: String(product._id),
  slug: product.slug,
  name: product.name,
  description: product.description,
  categorySlug: product.categorySlug,
  imageUrl: product.thumbnail,
  price: product.finalPrice ?? product.price,
  currency: "USD",
  badge: product.discountPercentage ? `${product.discountPercentage}% OFF` : undefined,
  rating: product.ratingsAverage,
  reviewCount: product.ratingsCount,
});
