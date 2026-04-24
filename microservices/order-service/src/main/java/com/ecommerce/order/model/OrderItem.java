package com.ecommerce.order.model;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Embedded order item — stores a product snapshot (name, price, thumbnail)
 * so we never need to query the product-service after order creation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem implements Serializable {

    private String productId;
    private String name;
    private String thumbnail;
    private Integer quantity;
    private BigDecimal price;
}
