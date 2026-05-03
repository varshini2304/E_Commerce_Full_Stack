package com.ecommerce.vendor.service;

import com.ecommerce.vendor.dto.*;
import com.ecommerce.vendor.exception.ConflictException;
import com.ecommerce.vendor.exception.ResourceNotFoundException;
import com.ecommerce.vendor.exception.UnauthorizedException;
import com.ecommerce.vendor.model.Vendor;
import com.ecommerce.vendor.repository.VendorRepository;
import com.ecommerce.vendor.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Vendor service — handles registration, authentication, and profile management.
 *
 * ─── Security Notes ───
 * - Passwords are BCrypt hashed (cost factor 10 by default)
 * - JWT tokens include role=VENDOR for gateway enforcement
 * - Password is NEVER returned in responses
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Register a new vendor.
     * Hashes password with BCrypt, generates JWT token.
     */
    public AuthResponse register(RegisterRequest request) {
        if (vendorRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already registered");
        }

        Vendor vendor = Vendor.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .businessName(request.getBusinessName())
                .build();

        vendor = vendorRepository.save(vendor);
        log.info("Vendor registered: {} ({})", vendor.getEmail(), vendor.getId());

        String token = jwtUtil.generateToken(vendor);
        return AuthResponse.builder()
                .token(token)
                .vendor(toResponse(vendor))
                .build();
    }

    /**
     * Authenticate vendor and return JWT.
     * Validates email + BCrypt password match.
     */
    public AuthResponse login(LoginRequest request) {
        Vendor vendor = vendorRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), vendor.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        log.info("Vendor logged in: {} ({})", vendor.getEmail(), vendor.getId());

        String token = jwtUtil.generateToken(vendor);
        return AuthResponse.builder()
                .token(token)
                .vendor(toResponse(vendor))
                .build();
    }

    /**
     * Get vendor profile by ID.
     */
    public VendorResponse getProfile(String vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
        return toResponse(vendor);
    }

    /**
     * Get vendor by ID (public lookup).
     */
    public VendorResponse getVendorById(String id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
        return toResponse(vendor);
    }

    /**
     * Convert entity to response DTO (excludes password).
     */
    private VendorResponse toResponse(Vendor vendor) {
        return VendorResponse.builder()
                .id(vendor.getId())
                .name(vendor.getName())
                .email(vendor.getEmail())
                .businessName(vendor.getBusinessName())
                .isVerified(vendor.getIsVerified())
                .createdAt(vendor.getCreatedAt())
                .build();
    }
}
