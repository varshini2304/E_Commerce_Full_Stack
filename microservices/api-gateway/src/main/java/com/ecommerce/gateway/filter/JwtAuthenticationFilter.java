package com.ecommerce.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Global JWT authentication filter for the API Gateway.
 *
 * ─── Auth Flow (Interview-Ready) ───
 *
 * 1. Token Generation:
 *    Customer → POST /api/auth/login  → Monolith  → returns JWT (role=USER, sub=email)
 *    Vendor   → POST /api/vendors/login → Vendor Service → returns JWT (role=VENDOR, sub=vendorId)
 *
 * 2. Token Validation (this filter):
 *    Client → Gateway (validates JWT signature + expiration)
 *    If valid → forwards request with trusted headers:
 *       X-User-Id:    vendorId or email (from JWT subject)
 *       X-User-Email: email (from JWT subject or email claim)
 *       X-User-Role:  VENDOR or USER (from JWT role claim)
 *       X-Auth-Token: <raw JWT>
 *
 * 3. How Services Trust Gateway:
 *    - Services are on a private Docker network (ecommerce-net)
 *    - Only the Gateway is exposed to the internet (port 8080)
 *    - Services trust X-User-* headers because only Gateway can reach them
 *    - In production: add mutual TLS or API keys between Gateway ↔ Services
 *
 * 4. Role-Based Access:
 *    - VENDOR role: can create/update/delete products, manage stock
 *    - USER role: can place orders, manage cart
 *    - GET endpoints on products/categories: public (no auth)
 *
 * 5. Public Endpoints:
 *    - GET /api/products/** → no auth needed
 *    - GET /api/categories/** → no auth needed
 *    - POST /api/auth/** → no auth needed
 *    - POST /api/vendors/register → no auth needed
 *    - POST /api/vendors/login → no auth needed
 *    - /health → health check
 */
@Slf4j
@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        String method = request.getMethod().name();

        // Allow public endpoints without authentication
        if (isPublicPath(path, method)) {
            return chain.filter(exchange);
        }

        // Check for Authorization header
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Missing or invalid Authorization header for path: {}", path);
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String subject = claims.getSubject();  // vendorId (for VENDOR) or email (for USER)
            String role = claims.get("role", String.class);  // VENDOR or USER
            String email = claims.get("email", String.class);  // email claim (if present)

            // ─── Role-Based Access Enforcement ───
            // Only VENDOR role can create/update/delete products
            if (isVendorOnlyPath(path, method)) {
                if (role == null || !role.equalsIgnoreCase("VENDOR")) {
                    log.warn("Non-vendor user attempted vendor action: path={}, role={}", path, role);
                    exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                    return exchange.getResponse().setComplete();
                }
            }

            // Forward authenticated user identity to downstream services
            // Services trust these headers because only Gateway can reach them
            // (private Docker network isolation)
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-User-Id", subject)
                    .header("X-User-Email", email != null ? email : subject)
                    .header("X-User-Role", role != null ? role : "USER")
                    .header("X-Auth-Token", token)
                    .build();

            log.debug("JWT validated: subject={}, role={}, forwarding to {}", subject, role, path);
            return chain.filter(exchange.mutate().request(modifiedRequest).build());

        } catch (Exception e) {
            log.warn("JWT validation failed for path {}: {}", path, e.getMessage());
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    /**
     * Determines if a path is publicly accessible (no JWT required).
     *
     * Public paths:
     * - GET /api/products/** → product catalog (read-only)
     * - GET /api/categories/** → category listing (read-only)
     * - /api/auth/** → customer login, register
     * - /api/vendors/register → vendor registration
     * - /api/vendors/login → vendor login
     * - /health → health check
     */
    private boolean isPublicPath(String path, String method) {
        // GET requests to products and categories are public
        if ("GET".equals(method) && (path.startsWith("/api/products") || path.startsWith("/api/categories"))) {
            return true;
        }
        // Auth and home endpoints are always public
        if (path.startsWith("/api/auth/") || path.startsWith("/api/home") || path.startsWith("/api/site")) {
            return true;
        }
        // Vendor register and login are public
        if (path.equals("/api/vendors/register") || path.equals("/api/vendors/login")) {
            return true;
        }
        // Health check
        return path.equals("/health");
    }

    /**
     * Determines if a path requires VENDOR role.
     * POST/PUT/DELETE on products and stock endpoints are vendor-only.
     */
    private boolean isVendorOnlyPath(String path, String method) {
        // Product mutations require VENDOR role
        if (path.startsWith("/api/products") && ("POST".equals(method) || "PUT".equals(method) || "DELETE".equals(method))) {
            return true;
        }
        return false;
    }

    @Override
    public int getOrder() {
        return -1; // Run before all other filters (except logging)
    }
}
