package com.ecommerce.modules.order.model;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.math.BigDecimal;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    private Long productId;

    private String name;

    private String thumbnail;

    private Integer quantity;

    private BigDecimal price;
}
