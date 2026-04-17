package com.ecommerce.config;

import com.ecommerce.modules.banner.model.Banner;
import com.ecommerce.modules.banner.model.BannerType;
import com.ecommerce.modules.banner.repository.BannerRepository;
import com.ecommerce.modules.category.model.Category;
import com.ecommerce.modules.category.repository.CategoryRepository;
import com.ecommerce.modules.order.model.*;
import com.ecommerce.modules.order.repository.OrderRepository;
import com.ecommerce.modules.product.model.Product;
import com.ecommerce.modules.product.repository.ProductRepository;
import com.ecommerce.modules.user.model.Role;
import com.ecommerce.modules.user.model.User;
import com.ecommerce.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Seeds the database with initial data — only runs when the user table is empty.
 * All data matches the Node.js seeder.js exactly.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final BannerRepository bannerRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping.");
            return;
        }

        log.info("Seeding database...");

        String hashedPassword = passwordEncoder.encode("Password@123");

        // ── Users ──
        User admin = userRepository.save(User.builder()
                .name("Admin User").email("admin@example.com")
                .password(hashedPassword).role(Role.ROLE_ADMIN).isVerified(true).build());
        User customer1 = userRepository.save(User.builder()
                .name("Varshini Customer").email("customer1@example.com")
                .password(hashedPassword).role(Role.ROLE_CUSTOMER).isVerified(true).build());
        User customer2 = userRepository.save(User.builder()
                .name("Test Customer").email("customer2@example.com")
                .password(hashedPassword).role(Role.ROLE_CUSTOMER).isVerified(true).build());

        // ── Categories ──
        categoryRepository.saveAll(List.of(
                Category.builder().name("Electronics").slug("electronics")
                        .icon("https://placehold.co/128x128/1f4690/ffffff?text=Electronics")
                        .image("https://picsum.photos/seed/category-electronics/1200/700")
                        .description("Latest gadgets and electronics").build(),
                Category.builder().name("Fashion").slug("fashion")
                        .icon("https://placehold.co/128x128/f47f74/ffffff?text=Fashion")
                        .image("https://picsum.photos/seed/category-fashion/1200/700")
                        .description("Trending fashion and clothing").build(),
                Category.builder().name("Home & Kitchen").slug("home-kitchen")
                        .icon("https://placehold.co/128x128/6e7bb6/ffffff?text=Home")
                        .image("https://picsum.photos/seed/category-home-kitchen/1200/700")
                        .description("Essentials for your home").build(),
                Category.builder().name("Sports & Outdoors").slug("sports")
                        .icon("https://placehold.co/128x128/24a148/ffffff?text=Sports")
                        .image("https://picsum.photos/seed/category-sports/1200/700")
                        .description("Gear and equipment for every adventure").build(),
                Category.builder().name("Books & Media").slug("books")
                        .icon("https://placehold.co/128x128/6e1f6a/ffffff?text=Books")
                        .image("https://picsum.photos/seed/category-books/1200/700")
                        .description("Read more with our curated collection").build(),
                Category.builder().name("Health & Beauty").slug("beauty")
                        .icon("https://placehold.co/128x128/ff6f61/ffffff?text=Beauty")
                        .image("https://picsum.photos/seed/category-beauty/1200/700")
                        .description("Wellness and personal care products").build()
        ));

        // ── Products ──
        Product p1 = productRepository.save(Product.builder()
                .name("iPhone 15 Pro").slug("iphone-15-pro")
                .description("Latest Apple iPhone 15 Pro with A17 chip").brand("Apple")
                .price(new BigDecimal("1299")).discountPercentage(new BigDecimal("5"))
                .finalPrice(new BigDecimal("1234")).stock(25).sku("APL-IP15P-001")
                .categorySlug("electronics")
                .thumbnail("https://picsum.photos/seed/product-iphone15-thumb/900/900")
                .images(List.of("https://picsum.photos/seed/product-iphone15-1/1400/1000",
                        "https://picsum.photos/seed/product-iphone15-2/1400/1000"))
                .icon("https://placehold.co/128x128/242b5e/ffffff?text=Phone")
                .tags(List.of("smartphone", "apple", "mobile"))
                .ratingsAverage(new BigDecimal("4.8")).ratingsCount(120)
                .salesCount(200).build());

        Product p2 = productRepository.save(Product.builder()
                .name("Samsung Galaxy S24 Ultra").slug("samsung-galaxy-s24-ultra")
                .description("Flagship Samsung Galaxy S24 Ultra with Snapdragon 8 Gen 3").brand("Samsung")
                .price(new BigDecimal("1199")).discountPercentage(new BigDecimal("10"))
                .finalPrice(new BigDecimal("1079")).stock(30).sku("SMS-S24U-002")
                .categorySlug("electronics")
                .thumbnail("https://picsum.photos/seed/product-samsung-thumb/900/900")
                .images(List.of("https://picsum.photos/seed/product-samsung-1/900/900",
                        "https://picsum.photos/seed/product-samsung-2/900/900"))
                .icon("https://placehold.co/128x128/242b5e/ffffff?text=Phone")
                .tags(List.of("smartphone", "android", "mobile"))
                .ratingsAverage(new BigDecimal("4.7")).ratingsCount(98)
                .salesCount(150).build());

        Product p3 = productRepository.save(Product.builder()
                .name("Google Pixel 8").slug("google-pixel-8")
                .description("Google Pixel 8 with Tensor G3 chip and pure Android experience").brand("Google")
                .price(new BigDecimal("899")).discountPercentage(new BigDecimal("8"))
                .finalPrice(new BigDecimal("827")).stock(40).sku("GGL-PX8-003")
                .categorySlug("electronics")
                .thumbnail("https://picsum.photos/seed/product-pixel-thumb/900/900")
                .images(List.of("https://picsum.photos/seed/product-pixel-1/900/900",
                        "https://picsum.photos/seed/product-pixel-2/900/900"))
                .icon("https://placehold.co/128x128/242b5e/ffffff?text=Phone")
                .tags(List.of("smartphone", "android", "mobile"))
                .ratingsAverage(new BigDecimal("4.5")).ratingsCount(76)
                .salesCount(90).build());

        productRepository.save(Product.builder()
                .name("OnePlus 12").slug("oneplus-12")
                .description("OnePlus 12 with 200 MP camera and 120 Hz display").brand("OnePlus")
                .price(new BigDecimal("799")).discountPercentage(new BigDecimal("12"))
                .finalPrice(new BigDecimal("703")).stock(55).sku("OPL-12-004")
                .categorySlug("electronics")
                .thumbnail("https://picsum.photos/seed/product-oplus-thumb/900/900")
                .images(List.of("https://picsum.photos/seed/product-oplus-1/900/900",
                        "https://picsum.photos/seed/product-oplus-2/900/900"))
                .icon("https://placehold.co/128x128/242b5e/ffffff?text=Phone")
                .tags(List.of("smartphone", "android", "mobile"))
                .ratingsAverage(new BigDecimal("4.6")).ratingsCount(83)
                .salesCount(110).build());

        productRepository.save(Product.builder()
                .name("Nike Air Max").slug("nike-air-max")
                .description("Comfortable and stylish sports shoes").brand("Nike")
                .price(new BigDecimal("199")).discountPercentage(new BigDecimal("10"))
                .finalPrice(new BigDecimal("179")).stock(40).sku("NK-AMX-002")
                .categorySlug("fashion")
                .thumbnail("https://picsum.photos/seed/product-nike-thumb/900/900")
                .images(List.of("https://picsum.photos/seed/product-nike-1/1400/1000",
                        "https://picsum.photos/seed/product-nike-2/1400/1000"))
                .icon("https://placehold.co/128x128/161f46/ffffff?text=Shoes")
                .tags(List.of("shoes", "sports"))
                .ratingsAverage(new BigDecimal("4.5")).ratingsCount(85)
                .salesCount(130).build());

        productRepository.save(Product.builder()
                .name("Aero Headphones").slug("aero-headphones")
                .description("Premium over-ear audio experience").brand("Aero")
                .price(new BigDecimal("139")).discountPercentage(BigDecimal.ZERO)
                .finalPrice(new BigDecimal("139")).stock(12).sku("AER-HDP-003")
                .categorySlug("electronics")
                .thumbnail("https://picsum.photos/seed/product-headphone-thumb/900/900")
                .images(List.of("https://picsum.photos/seed/product-headphone-1/1400/1000"))
                .icon("https://placehold.co/128x128/33407a/ffffff?text=Audio")
                .tags(List.of("audio", "headphones"))
                .ratingsAverage(new BigDecimal("4.7")).ratingsCount(210)
                .salesCount(300).build());

        productRepository.save(Product.builder()
                .name("Cloud Mug").slug("cloud-mug")
                .description("Ceramic mug for everyday use").brand("Cloud")
                .price(new BigDecimal("27")).discountPercentage(BigDecimal.ZERO)
                .finalPrice(new BigDecimal("27")).stock(51).sku("CLD-MUG-004")
                .categorySlug("home-kitchen")
                .thumbnail("https://picsum.photos/seed/product-mug-thumb/900/900")
                .images(List.of("https://picsum.photos/seed/product-mug-1/1400/1000"))
                .icon("https://placehold.co/128x128/5174a4/ffffff?text=Mug")
                .tags(List.of("mug", "kitchen"))
                .ratingsAverage(new BigDecimal("4.3")).ratingsCount(66)
                .salesCount(95).build());

        // ── Banners ──
        // Hero banners
        bannerRepository.saveAll(List.of(
                Banner.builder().title("Mega Electronics Sale").subtitle("Up to 50% OFF")
                        .description("Grab the best gadgets at unbeatable prices.")
                        .image("https://picsum.photos/seed/banner-hero-electronics/1600/700")
                        .mobileImage("https://picsum.photos/seed/banner-hero-electronics-mobile/900/1200")
                        .icon("https://placehold.co/128x128/f5a623/ffffff?text=Sale")
                        .link("/category/electronics").type(BannerType.HERO).position(1).build(),
                Banner.builder().title("Fashion Fest 2026").subtitle("Flat 30% OFF")
                        .description("Trending styles curated for you.")
                        .image("https://picsum.photos/seed/banner-hero-fashion/1600/700")
                        .mobileImage("https://picsum.photos/seed/banner-hero-fashion-mobile/900/1200")
                        .icon("https://placehold.co/128x128/f47f74/ffffff?text=Style")
                        .link("/category/fashion").type(BannerType.HERO).position(2).build()
        ));

        // Promo banners
        bannerRepository.save(Banner.builder()
                .title("Smart Home Essentials").subtitle("Upgrade Your Living")
                .description("Top-rated home appliances at special prices.")
                .image("https://picsum.photos/seed/banner-promo-home/1600/700")
                .mobileImage("https://picsum.photos/seed/banner-promo-home-mobile/900/1200")
                .icon("https://placehold.co/128x128/3f5b91/ffffff?text=Home")
                .link("/category/home-kitchen").type(BannerType.PROMO).position(1).build());

        // Category banners
        bannerRepository.saveAll(List.of(
                Banner.builder().title("Electronics Deals").subtitle("New Arrivals Everyday")
                        .description("Explore latest gadgets.")
                        .image("https://picsum.photos/seed/banner-category-electronics/1600/700")
                        .mobileImage("https://picsum.photos/seed/banner-category-electronics-mobile/900/1200")
                        .icon("https://placehold.co/128x128/1f4690/ffffff?text=Tech")
                        .link("/category/electronics").type(BannerType.CATEGORY).position(1).build(),
                Banner.builder().title("Fashion Finds").subtitle("Trending Styles")
                        .description("Discover the latest fashion collections.")
                        .image("https://picsum.photos/seed/banner-category-fashion/1600/700")
                        .mobileImage("https://picsum.photos/seed/banner-category-fashion-mobile/900/1200")
                        .icon("https://placehold.co/128x128/f47f74/ffffff?text=Style")
                        .link("/category/fashion").type(BannerType.CATEGORY).position(2).build(),
                Banner.builder().title("Home & Kitchen").subtitle("Essentials for Every Home")
                        .description("Upgrade your living space with our homeware.")
                        .image("https://picsum.photos/seed/banner-category-home/1600/700")
                        .mobileImage("https://picsum.photos/seed/banner-category-home-mobile/900/1200")
                        .icon("https://placehold.co/128x128/6e7bb6/ffffff?text=Home")
                        .link("/category/home-kitchen").type(BannerType.CATEGORY).position(3).build(),
                Banner.builder().title("Sports Gear").subtitle("Gear Up & Go")
                        .description("Everything you need for your next adventure.")
                        .image("https://picsum.photos/seed/banner-category-sports/1600/700")
                        .mobileImage("https://picsum.photos/seed/banner-category-sports-mobile/900/1200")
                        .icon("https://placehold.co/128x128/24a148/ffffff?text=Sports")
                        .link("/category/sports").type(BannerType.CATEGORY).position(4).build(),
                Banner.builder().title("Books & Media").subtitle("Read, Learn, Enjoy")
                        .description("Find your next great read or binge-worthy media.")
                        .image("https://picsum.photos/seed/banner-category-books/1600/700")
                        .mobileImage("https://picsum.photos/seed/banner-category-books-mobile/900/1200")
                        .icon("https://placehold.co/128x128/6e1f6a/ffffff?text=Books")
                        .link("/category/books").type(BannerType.CATEGORY).position(5).build()
        ));

        // Offer banners
        bannerRepository.save(Banner.builder()
                .title("Weekend Special Offer").subtitle("Extra 10% OFF")
                .description("Use code: WEEKEND10")
                .image("https://picsum.photos/seed/banner-offer-weekend/1600/700")
                .mobileImage("https://picsum.photos/seed/banner-offer-weekend-mobile/900/1200")
                .icon("https://placehold.co/128x128/d15a48/ffffff?text=Offer")
                .link("/offers").type(BannerType.OFFER).position(1).build());

        // App banners
        bannerRepository.save(Banner.builder()
                .title("Download Our App").subtitle("Shop Faster & Smarter")
                .description("Available on iOS & Android.")
                .image("https://picsum.photos/seed/banner-app-download/1600/700")
                .mobileImage("https://picsum.photos/seed/banner-app-download-mobile/900/1200")
                .icon("https://placehold.co/128x128/4a63b4/ffffff?text=App")
                .link("/download-app").type(BannerType.APP).position(1).build());

        // ── Sample Orders ──
        // Order 1: delivered + paid
        orderRepository.save(Order.builder()
                .userId(customer1.getId())
                .items(List.of(
                        OrderItem.builder().productId(p1.getId()).name(p1.getName())
                                .thumbnail(p1.getThumbnail()).quantity(1).price(p1.getFinalPrice()).build(),
                        OrderItem.builder().productId(p2.getId()).name(p2.getName())
                                .thumbnail(p2.getThumbnail()).quantity(1).price(p2.getFinalPrice()).build()
                ))
                .subtotal(p1.getFinalPrice().add(p2.getFinalPrice()))
                .total(p1.getFinalPrice().add(p2.getFinalPrice()))
                .status(OrderStatus.DELIVERED)
                .paymentStatus(PaymentStatus.PAID)
                .isPaid(true)
                .build());

        // Order 2: processing + pending
        orderRepository.save(Order.builder()
                .userId(customer1.getId())
                .items(List.of(
                        OrderItem.builder().productId(p3.getId()).name(p3.getName())
                                .thumbnail(p3.getThumbnail()).quantity(1).price(p3.getFinalPrice()).build()
                ))
                .subtotal(p3.getFinalPrice())
                .total(p3.getFinalPrice())
                .status(OrderStatus.PROCESSING)
                .paymentStatus(PaymentStatus.PENDING)
                .isPaid(false)
                .build());

        log.info("Database seeded successfully!");
    }
}
