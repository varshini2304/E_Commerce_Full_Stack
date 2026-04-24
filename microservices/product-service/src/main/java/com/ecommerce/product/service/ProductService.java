package com.ecommerce.product.service;

import com.ecommerce.product.dto.ProductRequest;
import com.ecommerce.product.dto.ProductResponse;
import com.ecommerce.product.dto.StockUpdateRequest;
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
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final MongoTemplate mongoTemplate;

    /**
     * List products with pagination, filtering, and sorting.
     * Cached in Redis with 60-second TTL.
     */
    @Cacheable(value = "products",
            key = "#page + '-' + #limit + '-' + #category + '-' + #minPrice + '-' + #maxPrice + '-' + #rating + '-' + #search + '-' + #sort")
    public Map<String, Object> listProducts(int page, int limit, String category, BigDecimal minPrice,
                                             BigDecimal maxPrice, BigDecimal rating, String search, String sort) {
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
     */
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new ConflictException("SKU already exists");
        }

        Product product = Product.builder()
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
        log.info("Product created: {} (SKU: {})", product.getName(), product.getSku());
        return toResponse(product);
    }

    /**
     * Update an existing product.
     */
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse updateProduct(String id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

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
        log.info("Product updated: {} (ID: {})", product.getName(), product.getId());
        return toResponse(product);
    }

    /**
     * Soft-delete a product.
     */
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse deleteProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setIsActive(false);
        product = productRepository.save(product);
        log.info("Product soft-deleted: {} (ID: {})", product.getName(), product.getId());
        return toResponse(product);
    }

    /**
     * Update product stock.
     */
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse updateStock(String id, StockUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setStock(request.getStock());
        product = productRepository.save(product);
        log.info("Stock updated for product {} to {}", product.getId(), request.getStock());
        return toResponse(product);
    }

    /**
     * Convert entity to response DTO.
     */
    private ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
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
