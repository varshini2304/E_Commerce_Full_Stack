package com.ecommerce.modules.auth.controller;

import com.ecommerce.modules.auth.dto.*;
import com.ecommerce.modules.auth.service.AuthService;
import com.ecommerce.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse data = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", data));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse data = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", data));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<AuthResponse.UserDto>> getProfile(Authentication authentication) {
        AuthResponse.UserDto data = authService.getProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Profile fetched", data));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<AuthResponse.UserDto>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest request
    ) {
        AuthResponse.UserDto data = authService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", data));
    }
}
