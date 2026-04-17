package com.ecommerce.modules.cart.service;

import com.ecommerce.modules.cart.dto.AddToCartRequest;
import com.ecommerce.modules.cart.dto.UpdateCartRequest;
import com.ecommerce.modules.cart.model.Cart;
import com.ecommerce.modules.cart.model.CartItem;
import com.ecommerce.modules.cart.repository.CartRepository;
import com.ecommerce.modules.product.model.Product;
import com.ecommerce.modules.product.repository.ProductRepository;
import com.ecommerce.shared.exception.BadRequestException;
import com.ecommerce.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public Cart getCart(Long userId) {
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

    public Cart addItem(Long userId, AddToCartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .filter(Product::getIsActive)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock");
        }

        Cart cart = getCart(userId);

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.getProductId()))
                .findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + request.getQuantity());
        } else {
            cart.getItems().add(CartItem.builder()
                    .productId(request.getProductId())
                    .quantity(request.getQuantity())
                    .priceAtAddTime(product.getFinalPrice())
                    .build());
        }

        recalculateTotal(cart);
        return cartRepository.save(cart);
    }

    public Cart updateItem(Long userId, UpdateCartRequest request) {
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

    public Cart removeItem(Long userId, Long productId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        recalculateTotal(cart);
        return cartRepository.save(cart);
    }

    private void recalculateTotal(Cart cart) {
        BigDecimal total = cart.getItems().stream()
                .map(item -> item.getPriceAtAddTime().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(total);
    }
}
