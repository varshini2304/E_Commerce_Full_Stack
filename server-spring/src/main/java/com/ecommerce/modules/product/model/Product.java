package com.ecommerce.modules.product.model;

import com.ecommerce.shared.util.StringListConverter;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private String brand = "";

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Builder.Default
    @Column(precision = 5, scale = 2)
    private BigDecimal discountPercentage = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal finalPrice;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private String categorySlug;

    @Column(nullable = false)
    private String thumbnail;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "JSON")
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Builder.Default
    private String icon = "";

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "JSON")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Builder.Default
    @Column(precision = 3, scale = 1)
    private BigDecimal ratingsAverage = BigDecimal.ZERO;

    @Builder.Default
    private Integer ratingsCount = 0;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Integer views = 0;

    @Builder.Default
    private Integer salesCount = 0;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
