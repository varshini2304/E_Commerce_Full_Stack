package com.ecommerce.modules.category.controller;

import com.ecommerce.modules.category.dto.CategoryRequest;
import com.ecommerce.modules.category.model.Category;
import com.ecommerce.modules.category.service.CategoryService;
import com.ecommerce.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getCategories() {
        List<Category> data = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories fetched", data));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> createCategory(@Valid @RequestBody CategoryRequest request) {
        Category data = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created", data));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        Category data = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success("Category updated", data));
    }
}
