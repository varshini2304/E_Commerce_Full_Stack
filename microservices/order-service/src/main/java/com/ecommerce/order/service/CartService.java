package com.ecommerce.order.service;

import com.ecommerce.order.dto.AddToCartRequest;
import com.ecommerce.order.dto.UpdateCartRequest;
import com.ecommerce.order.exception.ResourceNotFoundException;
import com.ecommerce.order.model.Cart;
import com.ecommerce.order.model.CartItem;
import com.ecommerce.order.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

/**
 * Cart service — lives inside order-service because:
 * 1. Creating an order consumes the cart (single transaction, no cross-service call)
 * 2. Simpler architecture for the current scale
 * 3. Can be extracted into its own service later if scaling requires
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;

    public Cart getCart(String userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart cart = Cart.builder()
                            .userId(userId)
                            .items(new ArrayList<>())
                            .totalAmount(BigDecimal.ZERO)
                            .build();
                    return cartRepository.save(cart);
                });
    }

    public Cart addItem(String userId, AddToCartRequest request) {
        Cart cart = getCart(userId);

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.getProductId()))
                .findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + request.getQuantity());
        } else {
            cart.getItems().add(CartItem.builder()
                    .productId(request.getProductId())
                    .name(request.getName())
                    .thumbnail(request.getThumbnail())
                    .quantity(request.getQuantity())
                    .priceAtAddTime(request.getPrice())
                    .build());
        }

        recalculateTotal(cart);
        cart = cartRepository.save(cart);
        log.info("Item added to cart for userId={}, productId={}", userId, request.getProductId());
        return cart;
    }

    public Cart updateItem(String userId, UpdateCartRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        CartItem target = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.getProductId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item not in cart"));

        target.setQuantity(request.getQuantity());
        recalculateTotal(cart);
        return cartRepository.save(cart);
    }

    public Cart removeItem(String userId, String productId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        recalculateTotal(cart);
        return cartRepository.save(cart);
    }

    public Cart clearCart(String userId) {
        Cart cart = getCart(userId);
        cart.getItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        return cartRepository.save(cart);
    }

    private void recalculateTotal(Cart cart) {
        BigDecimal total = cart.getItems().stream()
                .map(item -> item.getPriceAtAddTime().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(total);
    }
}
