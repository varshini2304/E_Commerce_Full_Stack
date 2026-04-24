package com.ecommerce.order.event;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * Event published to Kafka topic "order-created" when a new order is placed.
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
