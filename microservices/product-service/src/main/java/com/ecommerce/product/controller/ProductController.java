package com.ecommerce.product.controller;

import com.ecommerce.product.dto.ProductRequest;
import com.ecommerce.product.dto.ProductResponse;
import com.ecommerce.product.dto.StockUpdateRequest;
import com.ecommerce.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> listProducts(
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
        return ResponseEntity.ok(buildSuccess("Products fetched", data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable String id) {
        ProductResponse data = productService.getProductById(id);
        return ResponseEntity.ok(buildSuccess("Product fetched", data));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Map<String, Object>> getProductBySlug(@PathVariable String slug) {
        ProductResponse data = productService.getProductBySlug(slug);
        return ResponseEntity.ok(buildSuccess("Product fetched", data));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse data = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(buildSuccess("Product created", data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(
            @PathVariable String id, @Valid @RequestBody ProductRequest request) {
        ProductResponse data = productService.updateProduct(id, request);
        return ResponseEntity.ok(buildSuccess("Product updated", data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable String id) {
        ProductResponse data = productService.deleteProduct(id);
        return ResponseEntity.ok(buildSuccess("Product deleted", data));
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<Map<String, Object>> updateStock(
            @PathVariable String id, @Valid @RequestBody StockUpdateRequest request) {
        ProductResponse data = productService.updateStock(id, request);
        return ResponseEntity.ok(buildSuccess("Stock updated", data));
    }

    private Map<String, Object> buildSuccess(String message, Object data) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("data", data);
        return response;
    }
}
