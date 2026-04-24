package com.ecommerce.order.model;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Embedded cart item — stores productId and price snapshot at add time.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItem implements Serializable {

    private String productId;
    private String name;
    private String thumbnail;
    private Integer quantity;
    private BigDecimal priceAtAddTime;
}
