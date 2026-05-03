package com.ecommerce.product.service;

import com.ecommerce.product.dto.ProductRequest;
import com.ecommerce.product.dto.ProductResponse;
import com.ecommerce.product.dto.StockUpdateRequest;
import com.ecommerce.product.event.ProductCreatedEvent;
import com.ecommerce.product.exception.BadRequestException;
import com.ecommerce.product.exception.ConflictException;
import com.ecommerce.product.exception.ResourceNotFoundException;
import com.ecommerce.product.model.Product;
import com.ecommerce.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

/**
 * Product service with vendor ownership, caching, and Kafka event publishing.
 *
 * ─── Security Model ───
 * - vendorId is ALWAYS taken from the X-User-Id header (set by gateway)
 * - NEVER from the request body (prevents spoofing)
 * - Update/delete operations validate vendor ownership
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final MongoTemplate mongoTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * List products with pagination, filtering, and sorting.
     * Supports optional vendorId filter for vendor-specific product listing.
     * Cached in Redis with 60-second TTL.
     */
    @Cacheable(value = "products",
            key = "#page + '-' + #limit + '-' + #category + '-' + #minPrice + '-' + #maxPrice + '-' + #rating + '-' + #search + '-' + #sort + '-' + #vendorId")
    public Map<String, Object> listProducts(int page, int limit, String category, BigDecimal minPrice,
                                             BigDecimal maxPrice, BigDecimal rating, String search, String sort,
                                             String vendorId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("isActive").is(true));

        if (category != null && !category.isBlank()) {
            query.addCriteria(Criteria.where("categorySlug").is(category));
        }
        if (minPrice != null) {
            query.addCriteria(Criteria.where("finalPrice").gte(minPrice));
        }
        if (maxPrice != null) {
            query.addCriteria(Criteria.where("finalPrice").lte(maxPrice));
        }
        if (rating != null) {
            query.addCriteria(Criteria.where("ratingsAverage").gte(rating));
        }
        if (search != null && !search.isBlank()) {
            query.addCriteria(Criteria.where("name").regex(search, "i"));
        }
        if (vendorId != null && !vendorId.isBlank()) {
            query.addCriteria(Criteria.where("vendorId").is(vendorId));
        }

        long total = mongoTemplate.count(query, Product.class);

        Sort sortOrder = buildSort(sort);
        Pageable pageable = PageRequest.of(page - 1, limit, sortOrder);
        query.with(pageable);

        List<Product> products = mongoTemplate.find(query, Product.class);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("products", products.stream().map(this::toResponse).toList());
        result.put("total", total);
        result.put("page", page);
        result.put("pages", (int) Math.ceil((double) total / limit));
        return result;
    }

    /**
     * Get product by slug and increment view count.
     */
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlugAndIsActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Increment views atomically
        mongoTemplate.updateFirst(
                Query.query(Criteria.where("id").is(product.getId())),
                new Update().inc("views", 1),
                Product.class
        );

        return toResponse(product);
    }

    /**
     * Get product by ID.
     */
    public ProductResponse getProductById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return toResponse(product);
    }

    /**
     * Create a new product.
     *
     * ─── Security ───
     * vendorId comes from the trusted X-User-Id header (gateway-validated).
     * After saving, publishes "product-created" Kafka event for Inventory Service.
     */
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse createProduct(ProductRequest request, String vendorId) {
        if (vendorId == null || vendorId.isBlank()) {
            throw new BadRequestException("Vendor identity is required to create a product");
        }

        if (productRepository.existsBySku(request.getSku())) {
            throw new ConflictException("SKU already exists");
        }

        Product product = Product.builder()
                .vendorId(vendorId)
                .name(request.getName())
                .slug(request.getSlug())
                .description(request.getDescription())
                .brand(request.getBrand() != null ? request.getBrand() : "")
                .price(request.getPrice())
                .discountPercentage(request.getDiscountPercentage() != null ? request.getDiscountPercentage() : BigDecimal.ZERO)
                .finalPrice(request.getFinalPrice())
                .stock(request.getStock())
                .sku(request.getSku())
                .categorySlug(request.getCategorySlug())
                .thumbnail(request.getThumbnail())
                .images(request.getImages() != null ? request.getImages() : new ArrayList<>())
                .icon(request.getIcon() != null ? request.getIcon() : "")
                .tags(request.getTags() != null ? request.getTags() : new ArrayList<>())
                .build();

        product = productRepository.save(product);
        log.info("Product created by vendor {}: {} (SKU: {})", vendorId, product.getName(), product.getSku());

        // Publish Kafka event for Inventory Service to create initial stock
        publishProductCreatedEvent(product);

        return toResponse(product);
    }

    /**
     * Update an existing product.
     *
     * ─── Security ───
     * Validates that the requesting vendor (X-User-Id) owns the product.
     * Prevents vendor A from editing vendor B's products.
     */
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse updateProduct(String id, ProductRequest request, String vendorId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Ownership validation: vendor can only update their own products
        if (vendorId != null && !vendorId.equals(product.getVendorId())) {
            throw new BadRequestException("You can only update your own products");
        }

        product.setName(request.getName());
        product.setSlug(request.getSlug());
        product.setDescription(request.getDescription());
        if (request.getBrand() != null) product.setBrand(request.getBrand());
        product.setPrice(request.getPrice());
        if (request.getDiscountPercentage() != null) product.setDiscountPercentage(request.getDiscountPercentage());
        product.setFinalPrice(request.getFinalPrice());
        product.setStock(request.getStock());
        product.setSku(request.getSku());
        product.setCategorySlug(request.getCategorySlug());
        product.setThumbnail(request.getThumbnail());
        if (request.getImages() != null) product.setImages(request.getImages());
        if (request.getIcon() != null) product.setIcon(request.getIcon());
        if (request.getTags() != null) product.setTags(request.getTags());

        product = productRepository.save(product);
        log.info("Product updated by vendor {}: {} (ID: {})", vendorId, product.getName(), product.getId());
        return toResponse(product);
    }

    /**
     * Soft-delete a product.
     * Validates vendor ownership before deletion.
     */
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse deleteProduct(String id, String vendorId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Ownership validation
        if (vendorId != null && !vendorId.equals(product.getVendorId())) {
            throw new BadRequestException("You can only delete your own products");
        }

        product.setIsActive(false);
        product = productRepository.save(product);
        log.info("Product soft-deleted by vendor {}: {} (ID: {})", vendorId, product.getName(), product.getId());
        return toResponse(product);
    }

    /**
     * Update product stock.
     * Validates vendor ownership.
     */
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse updateStock(String id, StockUpdateRequest request, String vendorId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Ownership validation
        if (vendorId != null && !vendorId.equals(product.getVendorId())) {
            throw new BadRequestException("You can only update stock for your own products");
        }

        product.setStock(request.getStock());
        product = productRepository.save(product);
        log.info("Stock updated by vendor {} for product {} to {}", vendorId, product.getId(), request.getStock());
        return toResponse(product);
    }

    /**
     * Publish product-created event to Kafka.
     * Inventory Service consumes this to auto-create initial stock entry.
     */
    private void publishProductCreatedEvent(Product product) {
        try {
            ProductCreatedEvent event = ProductCreatedEvent.builder()
                    .productId(product.getId())
                    .vendorId(product.getVendorId())
                    .name(product.getName())
                    .sku(product.getSku())
                    .stock(product.getStock())
                    .price(product.getPrice())
                    .build();

            kafkaTemplate.send("product-created", product.getId(), event);
            log.info("Published product-created event: productId={}, vendorId={}", product.getId(), product.getVendorId());
        } catch (Exception e) {
            // Log but don't fail product creation — inventory can be created manually
            log.error("Failed to publish product-created event for productId={}: {}", product.getId(), e.getMessage());
        }
    }

    /**
     * Convert entity to response DTO.
     */
    private ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .vendorId(product.getVendorId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .brand(product.getBrand())
                .price(product.getPrice())
                .discountPercentage(product.getDiscountPercentage())
                .finalPrice(product.getFinalPrice())
                .stock(product.getStock())
                .sku(product.getSku())
                .categorySlug(product.getCategorySlug())
                .thumbnail(product.getThumbnail())
                .images(product.getImages())
                .icon(product.getIcon())
                .tags(product.getTags())
                .ratingsAverage(product.getRatingsAverage())
                .ratingsCount(product.getRatingsCount())
                .isActive(product.getIsActive())
                .views(product.getViews())
                .salesCount(product.getSalesCount())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    private Sort buildSort(String sort) {
        if (sort == null) return Sort.by(Sort.Direction.DESC, "createdAt");
        return switch (sort) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "finalPrice");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "finalPrice");
            case "newest" -> Sort.by(Sort.Direction.DESC, "createdAt");
            case "rating_desc" -> Sort.by(Sort.Direction.DESC, "ratingsAverage");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}
