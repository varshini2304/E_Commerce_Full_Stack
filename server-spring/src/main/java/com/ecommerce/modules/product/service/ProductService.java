package com.ecommerce.modules.product.service;

import com.ecommerce.modules.product.dto.ProductRequest;
import com.ecommerce.modules.product.dto.StockUpdateRequest;
import com.ecommerce.modules.product.model.Product;
import com.ecommerce.modules.product.repository.ProductRepository;
import com.ecommerce.modules.review.model.Review;
import com.ecommerce.modules.review.repository.ReviewRepository;
import com.ecommerce.shared.exception.ConflictException;
import com.ecommerce.shared.exception.ResourceNotFoundException;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

    @Cacheable(value = "products", key = "#page + '-' + #limit + '-' + #category + '-' + #minPrice + '-' + #maxPrice + '-' + #rating + '-' + #search + '-' + #sort")
    public Map<String, Object> listProducts(int page, int limit, String category, BigDecimal minPrice,
                                             BigDecimal maxPrice, BigDecimal rating, String search, String sort) {
        Specification<Product> spec = buildSpecification(category, minPrice, maxPrice, rating, search);
        Sort sortOrder = buildSort(sort);
        Pageable pageable = PageRequest.of(page - 1, limit, sortOrder);

        Page<Product> productPage = productRepository.findAll(spec, pageable);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("products", productPage.getContent());
        result.put("total", productPage.getTotalElements());
        result.put("page", page);
        result.put("pages", productPage.getTotalPages());
        return result;
    }

    @Transactional
    public Map<String, Object> getProductBySlug(String slug) {
        Product product = productRepository.findBySlugAndIsActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Increment views
        productRepository.incrementViews(product.getId());

        // Fetch reviews
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(product.getId());

        // Fetch related products
        List<Product> relatedProducts = productRepository.findByCategorySlugAndIsActiveTrueAndIdNot(
                product.getCategorySlug(), product.getId(), PageRequest.of(0, 4));

        Map<String, Object> result = new LinkedHashMap<>();
        Map<String, Object> productWithReviews = new LinkedHashMap<>();
        productWithReviews.put("product", product);
        productWithReviews.put("reviews", reviews);

        result.put("product", product);
        result.put("reviews", reviews);
        result.put("relatedProducts", relatedProducts);
        return result;
    }

    @CacheEvict(value = {"products", "home"}, allEntries = true)
    public Product createProduct(ProductRequest request) {
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

        return productRepository.save(product);
    }

    @CacheEvict(value = {"products", "home"}, allEntries = true)
    public Product updateProduct(Long id, ProductRequest request) {
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

        return productRepository.save(product);
    }

    @CacheEvict(value = {"products", "home"}, allEntries = true)
    public Product deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setIsActive(false);
        return productRepository.save(product);
    }

    @CacheEvict(value = {"products", "home"}, allEntries = true)
    public Product updateStock(Long id, StockUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setStock(request.getStock());
        return productRepository.save(product);
    }

    private Specification<Product> buildSpecification(String category, BigDecimal minPrice,
                                                       BigDecimal maxPrice, BigDecimal rating, String search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("isActive")));

            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("categorySlug"), category));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("finalPrice"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("finalPrice"), maxPrice));
            }
            if (rating != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("ratingsAverage"), rating));
            }
            if (search != null && !search.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
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
