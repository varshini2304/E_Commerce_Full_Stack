package com.ecommerce.inventory.event;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * Mirrors the OrderCreatedEvent published by order-service.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreatedEvent implements Serializable {

    private String orderId;
    private String userId;
    private List<OrderItemEvent> items;
    private BigDecimal totalPrice;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemEvent implements Serializable {
        private String productId;
        private String name;
        private Integer quantity;
        private BigDecimal price;
    }
}
