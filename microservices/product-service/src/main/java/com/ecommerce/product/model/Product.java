package com.ecommerce.product.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product implements Serializable {

    @Id
    private String id;

    @Indexed
    private String vendorId;

    private String name;

    @Indexed(unique = true)
    private String slug;

    private String description;

    @Builder.Default
    private String brand = "";

    private BigDecimal price;

    @Builder.Default
    private BigDecimal discountPercentage = BigDecimal.ZERO;

    private BigDecimal finalPrice;

    private Integer stock;

    @Indexed(unique = true)
    private String sku;

    @Indexed
    private String categorySlug;

    private String thumbnail;

    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Builder.Default
    private String icon = "";

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Builder.Default
    private BigDecimal ratingsAverage = BigDecimal.ZERO;

    @Builder.Default
    private Integer ratingsCount = 0;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Integer views = 0;

    @Builder.Default
    private Integer salesCount = 0;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
