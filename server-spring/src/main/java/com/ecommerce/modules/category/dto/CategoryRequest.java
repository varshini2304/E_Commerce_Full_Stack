package com.ecommerce.modules.category.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Slug is required")
    private String slug;

    @NotBlank(message = "Icon is required")
    private String icon;

    @NotBlank(message = "Image is required")
    private String image;

    private String description;
}
