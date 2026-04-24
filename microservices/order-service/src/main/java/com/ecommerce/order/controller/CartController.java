package com.ecommerce.order.controller;

import com.ecommerce.order.dto.AddToCartRequest;
import com.ecommerce.order.dto.UpdateCartRequest;
import com.ecommerce.order.model.Cart;
import com.ecommerce.order.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getCart(@PathVariable String userId) {
        Cart cart = cartService.getCart(userId);
        return ResponseEntity.ok(buildSuccess("Cart fetched", cart));
    }

    @PostMapping("/{userId}/items")
    public ResponseEntity<Map<String, Object>> addItem(
            @PathVariable String userId,
            @Valid @RequestBody AddToCartRequest request) {
        Cart cart = cartService.addItem(userId, request);
        return ResponseEntity.ok(buildSuccess("Item added to cart", cart));
    }

    @PutMapping("/{userId}/items")
    public ResponseEntity<Map<String, Object>> updateItem(
            @PathVariable String userId,
            @Valid @RequestBody UpdateCartRequest request) {
        Cart cart = cartService.updateItem(userId, request);
        return ResponseEntity.ok(buildSuccess("Cart item updated", cart));
    }

    @DeleteMapping("/{userId}/items/{productId}")
    public ResponseEntity<Map<String, Object>> removeItem(
            @PathVariable String userId,
            @PathVariable String productId) {
        Cart cart = cartService.removeItem(userId, productId);
        return ResponseEntity.ok(buildSuccess("Item removed from cart", cart));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> clearCart(@PathVariable String userId) {
        Cart cart = cartService.clearCart(userId);
        return ResponseEntity.ok(buildSuccess("Cart cleared", cart));
    }

    private Map<String, Object> buildSuccess(String message, Object data) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("data", data);
        return response;
    }
}
