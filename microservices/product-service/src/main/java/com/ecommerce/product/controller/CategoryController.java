package com.ecommerce.product.controller;

import com.ecommerce.product.dto.CategoryRequest;
import com.ecommerce.product.dto.CategoryResponse;
import com.ecommerce.product.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCategories() {
        List<CategoryResponse> data = categoryService.getAllCategories();
        return ResponseEntity.ok(buildSuccess("Categories fetched", data));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Map<String, Object>> getCategoryBySlug(@PathVariable String slug) {
        CategoryResponse data = categoryService.getCategoryBySlug(slug);
        return ResponseEntity.ok(buildSuccess("Category fetched", data));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createCategory(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse data = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(buildSuccess("Category created", data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateCategory(
            @PathVariable String id, @Valid @RequestBody CategoryRequest request) {
        CategoryResponse data = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(buildSuccess("Category updated", data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(buildSuccess("Category deleted", null));
    }

    private Map<String, Object> buildSuccess(String message, Object data) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("data", data);
        return response;
    }
}
