package com.ecommerce.modules.review.controller;

import com.ecommerce.modules.review.dto.ReviewRequest;
import com.ecommerce.modules.review.model.Review;
import com.ecommerce.modules.review.service.ReviewService;
import com.ecommerce.modules.user.model.User;
import com.ecommerce.modules.user.repository.UserRepository;
import com.ecommerce.shared.exception.ResourceNotFoundException;
import com.ecommerce.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Review>> createReview(
            Authentication authentication,
            @Valid @RequestBody ReviewRequest request
    ) {
        Long userId = getUserId(authentication);
        Review data = reviewService.createOrUpdateReview(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review submitted", data));
    }

    private Long getUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }
}
