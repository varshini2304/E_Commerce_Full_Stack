package com.ecommerce.product.controller;

import com.ecommerce.product.dto.ProductRequest;
import com.ecommerce.product.dto.ProductResponse;
import com.ecommerce.product.dto.StockUpdateRequest;
import com.ecommerce.product.exception.BadRequestException;
import com.ecommerce.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Product REST controller with vendor role enforcement.
 *
 * ─── Security Model ───
 * - GET endpoints: Public (no auth required)
 * - POST/PUT/DELETE: Require VENDOR role (enforced via X-User-Role header from gateway)
 * - vendorId: Always from X-User-Id header (never from request body)
 * - Ownership: ProductService validates vendor owns the product for update/delete
 */
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
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String vendorId
    ) {
        Map<String, Object> data = productService.listProducts(page, limit, category, minPrice, maxPrice, rating, search, sort, vendorId);
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

    /**
     * Create product — VENDOR role required.
     * vendorId is taken from the trusted X-User-Id header (set by gateway).
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createProduct(
            @Valid @RequestBody ProductRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {

        enforceVendorRole(userRole);
        ProductResponse data = productService.createProduct(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(buildSuccess("Product created", data));
    }

    /**
     * Update product — VENDOR role required + ownership validation.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody ProductRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {

        enforceVendorRole(userRole);
        ProductResponse data = productService.updateProduct(id, request, userId);
        return ResponseEntity.ok(buildSuccess("Product updated", data));
    }

    /**
     * Delete product — VENDOR role required + ownership validation.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {

        enforceVendorRole(userRole);
        ProductResponse data = productService.deleteProduct(id, userId);
        return ResponseEntity.ok(buildSuccess("Product deleted", data));
    }

    /**
     * Update stock — VENDOR role required + ownership validation.
     */
    @PutMapping("/{id}/stock")
    public ResponseEntity<Map<String, Object>> updateStock(
            @PathVariable String id,
            @Valid @RequestBody StockUpdateRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {

        enforceVendorRole(userRole);
        ProductResponse data = productService.updateStock(id, request, userId);
        return ResponseEntity.ok(buildSuccess("Stock updated", data));
    }

    /**
     * Enforce that the caller has VENDOR role.
     * The role is extracted from the JWT by the API Gateway and forwarded
     * as the X-User-Role header.
     */
    private void enforceVendorRole(String userRole) {
        if (userRole == null || !userRole.equalsIgnoreCase("VENDOR")) {
            throw new BadRequestException("Only vendors can perform this action");
        }
    }

    private Map<String, Object> buildSuccess(String message, Object data) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("data", data);
        return response;
    }
}
