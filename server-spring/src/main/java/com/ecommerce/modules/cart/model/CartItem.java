package com.ecommerce.modules.cart.model;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.math.BigDecimal;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    private Long productId;

    private Integer quantity;

    private BigDecimal priceAtAddTime;
}
