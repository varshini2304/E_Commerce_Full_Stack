package com.ecommerce.vendor.controller;

import com.ecommerce.vendor.dto.*;
import com.ecommerce.vendor.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Vendor REST controller.
 *
 * ─── Endpoints ───
 * POST /api/vendors/register  → Public — register new vendor
 * POST /api/vendors/login     → Public — authenticate vendor
 * GET  /api/vendors/profile   → Auth   — get own profile (from JWT/header)
 * GET  /api/vendors/{id}      → Auth   — get vendor by ID
 */
@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse data = vendorService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(buildSuccess("Vendor registered successfully", data));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse data = vendorService.login(request);
        return ResponseEntity.ok(buildSuccess("Login successful", data));
    }

    /**
     * Get own profile.
     * vendorId comes from:
     * 1. X-User-Id header (gateway-forwarded) — checked first
     * 2. JWT principal (direct auth)
     */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(
            @RequestHeader(value = "X-User-Id", required = false) String gatewayUserId) {

        String vendorId = resolveVendorId(gatewayUserId);
        VendorResponse data = vendorService.getProfile(vendorId);
        return ResponseEntity.ok(buildSuccess("Profile fetched", data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getVendorById(@PathVariable String id) {
        VendorResponse data = vendorService.getVendorById(id);
        return ResponseEntity.ok(buildSuccess("Vendor fetched", data));
    }

    /**
     * Resolve vendor ID from gateway header or JWT principal.
     * Gateway header takes priority (trusted network).
     */
    private String resolveVendorId(String gatewayUserId) {
        if (gatewayUserId != null && !gatewayUserId.isBlank()) {
            return gatewayUserId;
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() != null) {
            return auth.getPrincipal().toString();
        }
        throw new RuntimeException("Unable to resolve vendor identity");
    }

    private Map<String, Object> buildSuccess(String message, Object data) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("data", data);
        return response;
    }
}
