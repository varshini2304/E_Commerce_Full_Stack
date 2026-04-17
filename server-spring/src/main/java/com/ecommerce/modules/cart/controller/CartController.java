package com.ecommerce.modules.cart.controller;

import com.ecommerce.modules.cart.dto.AddToCartRequest;
import com.ecommerce.modules.cart.dto.UpdateCartRequest;
import com.ecommerce.modules.cart.model.Cart;
import com.ecommerce.modules.cart.service.CartService;
import com.ecommerce.modules.user.model.User;
import com.ecommerce.modules.user.repository.UserRepository;
import com.ecommerce.shared.exception.ResourceNotFoundException;
import com.ecommerce.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Cart>> getCart(Authentication authentication) {
        Long userId = getUserId(authentication);
        Cart data = cartService.getCart(userId);
        return ResponseEntity.ok(ApiResponse.success("Cart fetched", data));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Cart>> addToCart(
            Authentication authentication,
            @Valid @RequestBody AddToCartRequest request
    ) {
        Long userId = getUserId(authentication);
        Cart data = cartService.addItem(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", data));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<Cart>> updateCart(
            Authentication authentication,
            @Valid @RequestBody UpdateCartRequest request
    ) {
        Long userId = getUserId(authentication);
        Cart data = cartService.updateItem(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Cart item updated", data));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<ApiResponse<Cart>> removeFromCart(
            Authentication authentication,
            @PathVariable Long productId
    ) {
        Long userId = getUserId(authentication);
        Cart data = cartService.removeItem(userId, productId);
        return ResponseEntity.ok(ApiResponse.success("Cart item removed", data));
    }

    private Long getUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }
}
