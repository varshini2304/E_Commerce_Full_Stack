package com.ecommerce.modules.order.service;

import com.ecommerce.modules.cart.model.Cart;
import com.ecommerce.modules.cart.model.CartItem;
import com.ecommerce.modules.cart.repository.CartRepository;
import com.ecommerce.modules.order.model.Order;
import com.ecommerce.modules.order.model.OrderItem;
import com.ecommerce.modules.order.model.OrderStatus;
import com.ecommerce.modules.order.repository.OrderRepository;
import com.ecommerce.modules.product.model.Product;
import com.ecommerce.modules.product.repository.ProductRepository;
import com.ecommerce.shared.exception.BadRequestException;
import com.ecommerce.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    /**
     * Creates an order from the user's cart — mirrors Node.js createOrderFromCart with @Transactional
     * replacing Mongoose sessions.
     */
    @Transactional
    @CacheEvict(value = {"products", "home"}, allEntries = true)
    public Order createOrder(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cart.getItems()) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .filter(Product::getIsActive)
                    .orElseThrow(() -> new BadRequestException("Invalid cart product"));

            if (product.getStock() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + product.getName());
            }

            // Decrement stock, increment sales
            product.setStock(product.getStock() - cartItem.getQuantity());
            product.setSalesCount(product.getSalesCount() + cartItem.getQuantity());
            productRepository.save(product);

            orderItems.add(OrderItem.builder()
                    .productId(product.getId())
                    .name(product.getName())
                    .thumbnail(product.getThumbnail())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getPriceAtAddTime())
                    .build());
        }

        BigDecimal subtotal = orderItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .userId(userId)
                .items(orderItems)
                .subtotal(subtotal)
                .total(subtotal)
                .build();

        order = orderRepository.save(order);

        // Clear cart
        cart.getItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);

        return order;
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrderByIdForUser(Long userId, Long orderId) {
        return orderRepository.findById(orderId)
                .filter(order -> order.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order updateOrderStatus(Long id, String statusStr) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + statusStr);
        }

        // Validate transition
        Map<OrderStatus, List<OrderStatus>> transitions = Map.of(
                OrderStatus.PENDING, List.of(OrderStatus.PROCESSING),
                OrderStatus.PROCESSING, List.of(OrderStatus.SHIPPED),
                OrderStatus.SHIPPED, List.of(OrderStatus.DELIVERED),
                OrderStatus.DELIVERED, List.of(),
                OrderStatus.CANCELLED, List.of()
        );

        List<OrderStatus> allowed = transitions.getOrDefault(order.getStatus(), List.of());
        if (!allowed.contains(newStatus) && order.getStatus() != newStatus) {
            throw new BadRequestException("Invalid status transition");
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}
