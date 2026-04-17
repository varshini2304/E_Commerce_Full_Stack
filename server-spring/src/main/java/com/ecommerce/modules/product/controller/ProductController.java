package com.ecommerce.modules.product.controller;

import com.ecommerce.modules.product.dto.ProductRequest;
import com.ecommerce.modules.product.dto.StockUpdateRequest;
import com.ecommerce.modules.product.model.Product;
import com.ecommerce.modules.product.service.ProductService;
import com.ecommerce.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> listProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) BigDecimal rating,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort
    ) {
        Map<String, Object> data = productService.listProducts(page, limit, category, minPrice, maxPrice, rating, search, sort);
        return ResponseEntity.ok(ApiResponse.success("Products fetched", data));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProduct(@PathVariable String slug) {
        Map<String, Object> data = productService.getProductBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success("Product fetched", data));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Product>> createProduct(@Valid @RequestBody ProductRequest request) {
        Product data = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created", data));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        Product data = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated", data));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Product>> deleteProduct(@PathVariable Long id) {
        Product data = productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted", data));
    }

    @PutMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Product>> updateStock(
            @PathVariable Long id, @Valid @RequestBody StockUpdateRequest request) {
        Product data = productService.updateStock(id, request);
        return ResponseEntity.ok(ApiResponse.success("Stock updated", data));
    }
}
