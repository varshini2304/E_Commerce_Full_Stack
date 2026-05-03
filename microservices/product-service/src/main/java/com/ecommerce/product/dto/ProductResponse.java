package com.ecommerce.product.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private String id;
    private String vendorId;
    private String name;
    private String slug;
    private String description;
    private String brand;
    private BigDecimal price;
    private BigDecimal discountPercentage;
    private BigDecimal finalPrice;
    private Integer stock;
    private String sku;
    private String categorySlug;
    private String thumbnail;
    private List<String> images;
    private String icon;
    private List<String> tags;
    private BigDecimal ratingsAverage;
    private Integer ratingsCount;
    private Boolean isActive;
    private Integer views;
    private Integer salesCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
