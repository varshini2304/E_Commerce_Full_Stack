package com.ecommerce.modules.review.service;

import com.ecommerce.modules.order.model.OrderStatus;
import com.ecommerce.modules.order.repository.OrderRepository;
import com.ecommerce.modules.product.model.Product;
import com.ecommerce.modules.product.repository.ProductRepository;
import com.ecommerce.modules.review.dto.ReviewRequest;
import com.ecommerce.modules.review.model.Review;
import com.ecommerce.modules.review.repository.ReviewRepository;
import com.ecommerce.shared.exception.ForbiddenException;
import com.ecommerce.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional
    @CacheEvict(value = {"products", "home"}, allEntries = true)
    public Review createOrUpdateReview(Long userId, ReviewRequest request) {
        // Verify user purchased this product with SHIPPED or DELIVERED status
        List<OrderStatus> allowedStatuses = List.of(OrderStatus.SHIPPED, OrderStatus.DELIVERED);
        boolean hasPurchased = orderRepository.existsByUserIdAndStatusInAndItems_ProductId(
                userId, allowedStatuses, request.getProductId());

        if (!hasPurchased) {
            throw new ForbiddenException("You can review only purchased products");
        }

        // Upsert review
        Optional<Review> existingOpt = reviewRepository.findByUserIdAndProductId(userId, request.getProductId());
        Review review;
        if (existingOpt.isPresent()) {
            review = existingOpt.get();
            review.setRating(request.getRating());
            review.setComment(request.getComment() != null ? request.getComment() : "");
        } else {
            review = Review.builder()
                    .userId(userId)
                    .productId(request.getProductId())
                    .rating(request.getRating())
                    .comment(request.getComment() != null ? request.getComment() : "")
                    .build();
        }
        review = reviewRepository.save(review);

        // Recalculate product ratings
        BigDecimal avgRating = reviewRepository.averageRatingByProductId(request.getProductId());
        int count = reviewRepository.countByProductId(request.getProductId());

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setRatingsAverage(avgRating.setScale(1, RoundingMode.HALF_UP));
        product.setRatingsCount(count);
        productRepository.save(product);

        return review;
    }
}
