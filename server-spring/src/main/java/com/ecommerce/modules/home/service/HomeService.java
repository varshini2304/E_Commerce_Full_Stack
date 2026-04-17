package com.ecommerce.modules.home.service;

import com.ecommerce.modules.banner.model.Banner;
import com.ecommerce.modules.banner.model.BannerType;
import com.ecommerce.modules.banner.repository.BannerRepository;
import com.ecommerce.modules.category.model.Category;
import com.ecommerce.modules.category.repository.CategoryRepository;
import com.ecommerce.modules.product.model.Product;
import com.ecommerce.modules.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Home page service — mirrors the Node.js homeService.js getHomePageData() output exactly.
 */
@Service
@RequiredArgsConstructor
public class HomeService {

    private final BannerRepository bannerRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Cacheable("home")
    public Map<String, Object> getHomePageData() {
        LocalDateTime now = LocalDateTime.now();

        List<Banner> heroBanners = bannerRepository.findActiveBannersByType(BannerType.HERO, now);
        List<Banner> promoBanners = bannerRepository.findActiveBannersByType(BannerType.PROMO, now);
        List<Banner> categoryBanners = bannerRepository.findActiveBannersByType(BannerType.CATEGORY, now);
        List<Banner> offerBanners = bannerRepository.findActiveBannersByType(BannerType.OFFER, now);
        List<Banner> appBanners = bannerRepository.findActiveBannersByType(BannerType.APP, now);

        List<Category> categories = categoryRepository.findByIsActiveTrue(PageRequest.of(0, 8));
        List<Product> featuredProducts = productRepository.findByIsActiveTrueOrderByRatingsAverageDescSalesCountDesc(PageRequest.of(0, 8));
        List<Product> trendingProducts = productRepository.findByIsActiveTrueOrderBySalesCountDescCreatedAtDesc(PageRequest.of(0, 8));

        Banner heroBanner = heroBanners.isEmpty() ? null : heroBanners.get(0);
        Banner promoBanner = promoBanners.isEmpty() ? null : promoBanners.get(0);

        Map<String, Object> result = new LinkedHashMap<>();

        // Navigation
        Map<String, Object> navigation = new LinkedHashMap<>();
        navigation.put("logoText", "E-Commerce");
        navigation.put("homeHref", "/");
        navigation.put("searchPlaceholder", "Search...");
        navigation.put("searchAction", "/search");
        navigation.put("actions", List.of(
                Map.of("id", "wishlist", "label", "Wishlist", "href", "/wishlist", "icon", "wishlist"),
                Map.of("id", "cart", "label", "Cart", "href", "/cart", "icon", "cart", "badgeCount", 0),
                Map.of("id", "profile", "label", "Profile", "href", "/profile", "icon", "profile")
        ));
        result.put("navigation", navigation);

        // Section Headers
        Map<String, Object> sectionHeaders = new LinkedHashMap<>();
        sectionHeaders.put("categories", Map.of("title", "Shop by Category", "subtitle", "Popular picks this week"));
        sectionHeaders.put("featuredProducts", Map.of("title", "Featured Products", "ctaLabel", "Add to cart"));
        sectionHeaders.put("trendingProducts", Map.of("title", "Trending Products", "ctaLabel", "Add to cart"));
        sectionHeaders.put("newsletter", Map.of("title", "Get 20% Off Your First Order", "subtitle", "Sign up for updates and offers"));
        result.put("sectionHeaders", sectionHeaders);

        // Hero
        Map<String, Object> hero = new LinkedHashMap<>();
        hero.put("eyebrow", heroBanner != null ? heroBanner.getTitle() : "Limited Offer");
        hero.put("title", heroBanner != null ? heroBanner.getSubtitle() : "Big Savings Today");
        hero.put("subtitle", heroBanner != null ? heroBanner.getDescription() : "Discover exclusive offers and best-selling products.");
        hero.put("imageUrl", heroBanner != null ? heroBanner.getImage() : "");
        hero.put("imageAlt", heroBanner != null ? heroBanner.getTitle() : "Hero banner");
        hero.put("primaryAction", Map.of("label", "Shop Now", "href", heroBanner != null ? heroBanner.getLink() : "/products"));
        result.put("hero", hero);

        // Categories
        List<Map<String, Object>> categoryList = new ArrayList<>();
        for (Category cat : categories) {
            Map<String, Object> c = new LinkedHashMap<>();
            c.put("id", cat.getId());
            c.put("name", cat.getName());
            c.put("description", cat.getDescription());
            c.put("imageUrl", cat.getIcon() != null && !cat.getIcon().isEmpty() ? cat.getIcon() : cat.getImage());
            c.put("icon", cat.getSlug());
            categoryList.add(c);
        }
        result.put("categories", categoryList);

        // Featured Products
        result.put("featuredProducts", mapProductsForUI(featuredProducts));

        // Trending Products
        result.put("trendingProducts", mapProductsForUI(trendingProducts));

        // Promo Banner
        Map<String, Object> promo = new LinkedHashMap<>();
        promo.put("badge", promoBanner != null ? promoBanner.getTitle() : "Special Offer");
        promo.put("title", promoBanner != null ? promoBanner.getSubtitle() : "Save More on Every Order");
        promo.put("description", promoBanner != null ? promoBanner.getDescription() : "Limited-time promo from our curated collection.");
        promo.put("imageUrl", promoBanner != null ? promoBanner.getImage() : "");
        promo.put("imageAlt", promoBanner != null ? promoBanner.getTitle() : "Promo banner");
        promo.put("action", Map.of("label", "Explore", "href", promoBanner != null ? promoBanner.getLink() : "/products"));
        result.put("promoBanner", promo);

        // Newsletter
        Map<String, Object> newsletter = new LinkedHashMap<>();
        newsletter.put("title", "Subscribe");
        newsletter.put("description", "Get weekly deals straight to your inbox.");
        newsletter.put("emailPlaceholder", "Enter your email");
        newsletter.put("submitLabel", "Subscribe");
        newsletter.put("actionUrl", "/api/newsletter/subscribe");
        newsletter.put("method", "post");
        newsletter.put("disclaimer", "You can unsubscribe any time.");
        result.put("newsletter", newsletter);

        // Footer
        Map<String, Object> footer = new LinkedHashMap<>();
        footer.put("links", List.of(
                Map.of("label", "About Us", "href", "/about"),
                Map.of("label", "Contact", "href", "/contact"),
                Map.of("label", "Privacy Policy", "href", "/privacy"),
                Map.of("label", "Terms & Conditions", "href", "/terms")
        ));
        footer.put("socialLinks", List.of(
                Map.of("id", "facebook", "icon", "facebook", "label", "Facebook", "href", "#"),
                Map.of("id", "twitter", "icon", "twitter", "label", "Twitter", "href", "#"),
                Map.of("id", "pinterest", "icon", "pinterest", "label", "Pinterest", "href", "#")
        ));
        footer.put("copyrightText", "© 2026 E-Commerce. All rights reserved.");
        result.put("footer", footer);

        // Raw banner arrays
        result.put("heroBanners", heroBanners);
        result.put("promoBanners", promoBanners);
        result.put("categoryBanners", categoryBanners);
        result.put("offerBanners", offerBanners);
        result.put("appBanners", appBanners);

        return result;
    }

    private List<Map<String, Object>> mapProductsForUI(List<Product> products) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Product p : products) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", p.getId());
            m.put("slug", p.getSlug());
            m.put("name", p.getName());
            m.put("description", p.getDescription());
            m.put("categorySlug", p.getCategorySlug());
            m.put("imageUrl", p.getThumbnail());
            m.put("price", p.getFinalPrice() != null ? p.getFinalPrice() : p.getPrice());
            m.put("currency", "USD");
            if (p.getDiscountPercentage() != null && p.getDiscountPercentage().compareTo(BigDecimal.ZERO) > 0) {
                m.put("badge", p.getDiscountPercentage() + "% OFF");
            }
            m.put("rating", p.getRatingsAverage());
            m.put("reviewCount", p.getRatingsCount());
            list.add(m);
        }
        return list;
    }
}
