package com.ecommerce.product.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Slug is required")
    private String slug;

    @NotBlank(message = "Description is required")
    private String description;

    private String brand;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    private BigDecimal discountPercentage;

    @NotNull(message = "Final price is required")
    private BigDecimal finalPrice;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    @NotBlank(message = "SKU is required")
    private String sku;

    @NotBlank(message = "Category slug is required")
    private String categorySlug;

    @NotBlank(message = "Thumbnail is required")
    private String thumbnail;

    private List<String> images;
    private String icon;
    private List<String> tags;
}
