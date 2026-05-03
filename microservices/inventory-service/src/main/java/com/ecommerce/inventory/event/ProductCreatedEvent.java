package com.ecommerce.inventory.event;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Mirrors the ProductCreatedEvent published by product-service.
 * Consumed to auto-create initial inventory stock entries.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreatedEvent implements Serializable {

    private String productId;
    private String vendorId;
    private String name;
    private String sku;
    private Integer stock;
    private BigDecimal price;
}
