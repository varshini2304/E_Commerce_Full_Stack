package com.ecommerce.product.event;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Published to Kafka topic "product-created" when a vendor creates a product.
 * Consumed by Inventory Service to auto-create initial stock entry.
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
