package com.ecommerce.vendor.security;

import com.ecommerce.vendor.model.Vendor;
import com.ecommerce.vendor.repository.VendorRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JWT filter for vendor-service internal authentication.
 *
 * ─── Two auth modes ───
 * 1. Direct JWT: Vendor hits vendor-service directly with Bearer token
 * 2. Gateway forwarded: Gateway validates JWT and forwards X-User-Id header
 *
 * This filter handles mode 1 (JWT in Authorization header).
 * Mode 2 is handled by the gateway — vendor-service trusts X-User-Id header
 * when running behind the gateway (private network).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final VendorRepository vendorRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip auth for public endpoints
        if (isPublicPath(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Check for gateway-forwarded header first (trusted network)
        String gatewayUserId = request.getHeader("X-User-Id");
        if (gatewayUserId != null && !gatewayUserId.isBlank()) {
            // Gateway has already validated the JWT — trust the forwarded identity
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            gatewayUserId, null,
                            List.of(new SimpleGrantedAuthority("ROLE_VENDOR")));
            SecurityContextHolder.getContext().setAuthentication(auth);
            filterChain.doFilter(request, response);
            return;
        }

        // Direct JWT auth (when not behind gateway)
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authHeader.substring(7);
            String vendorId = jwtUtil.getVendorIdFromToken(token);

            Vendor vendor = vendorRepository.findById(vendorId).orElse(null);
            if (vendor != null) {
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                vendor.getId(), null,
                                List.of(new SimpleGrantedAuthority("ROLE_VENDOR")));
                SecurityContextHolder.getContext().setAuthentication(auth);
                log.debug("JWT authenticated vendor: {} ({})", vendor.getEmail(), vendor.getId());
            }
        } catch (Exception e) {
            log.warn("JWT validation failed: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPublicPath(String path) {
        return path.endsWith("/register") || path.endsWith("/login");
    }
}
