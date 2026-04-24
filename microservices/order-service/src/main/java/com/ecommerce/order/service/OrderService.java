package com.ecommerce.order.service;

import com.ecommerce.order.dto.CreateOrderRequest;
import com.ecommerce.order.dto.OrderStatusUpdateRequest;
import com.ecommerce.order.event.OrderCreatedEvent;
import com.ecommerce.order.exception.BadRequestException;
import com.ecommerce.order.exception.ResourceNotFoundException;
import com.ecommerce.order.kafka.OrderEventProducer;
import com.ecommerce.order.model.Order;
import com.ecommerce.order.model.OrderItem;
import com.ecommerce.order.model.OrderStatus;
import com.ecommerce.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderEventProducer orderEventProducer;

    /**
     * Creates a new order from the provided items (product snapshots).
     * Publishes an "order-created" Kafka event for downstream services.
     */
    public Order createOrder(CreateOrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order must have at least one item");
        }

        List<OrderItem> orderItems = request.getItems().stream()
                .map(item -> OrderItem.builder()
                        .productId(item.getProductId())
                        .name(item.getName())
                        .thumbnail(item.getThumbnail())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build())
                .toList();

        BigDecimal subtotal = orderItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .userId(request.getUserId())
                .items(orderItems)
                .subtotal(subtotal)
                .total(subtotal)
                .build();

        order = orderRepository.save(order);
        log.info("Order created: {} for userId={}", order.getId(), order.getUserId());

        // Publish Kafka event
        OrderCreatedEvent event = OrderCreatedEvent.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .totalPrice(order.getTotal())
                .items(orderItems.stream()
                        .map(item -> OrderCreatedEvent.OrderItemEvent.builder()
                                .productId(item.getProductId())
                                .name(item.getName())
                                .quantity(item.getQuantity())
                                .price(item.getPrice())
                                .build())
                        .toList())
                .build();

        orderEventProducer.publishOrderCreated(event);

        return order;
    }

    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order updateOrderStatus(String id, String statusStr) {
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
            throw new BadRequestException("Invalid status transition from " + order.getStatus() + " to " + newStatus);
        }

        order.setStatus(newStatus);
        order = orderRepository.save(order);
        log.info("Order {} status updated to {}", id, newStatus);
        return order;
    }
}
