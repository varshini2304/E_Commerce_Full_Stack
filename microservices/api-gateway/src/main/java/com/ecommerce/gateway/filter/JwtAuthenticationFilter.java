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
 *    Client → POST /api/auth/login → Monolith (user-service) → returns JWT
 *    JWT contains: subject=email, role, expiration
 *
 * 2. Token Validation (this filter):
 *    Client → Gateway (validates JWT signature + expiration)
 *    If valid → forwards request with trusted headers:
 *       X-User-Email: user@example.com
 *       X-Auth-Token: <raw JWT>
 *
 * 3. How Services Trust Gateway:
 *    - Services are on a private Docker network (ecommerce-net)
 *    - Only the Gateway is exposed to the internet (port 8080)
 *    - Services trust X-User-Email header because only Gateway can reach them
 *    - In production: add mutual TLS or API keys between Gateway ↔ Services
 *
 * 4. Public Endpoints:
 *    - GET /api/products/** → no auth needed
 *    - GET /api/categories/** → no auth needed
 *    - POST /api/auth/** → no auth needed
 *    - Everything else → JWT required
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

            String userEmail = claims.getSubject();

            // Forward authenticated user identity to downstream services
            // Services trust these headers because only Gateway can reach them
            // (private Docker network isolation)
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-User-Email", userEmail)
                    .header("X-Auth-Token", token)
                    .build();

            log.debug("JWT validated for user={}, forwarding to {}", userEmail, path);
            return chain.filter(exchange.mutate().request(modifiedRequest).build());

        } catch (Exception e) {
            log.warn("JWT validation failed for path {}: {}", path, e.getMessage());
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    /**
     * Determines if a path is publicly accessible.
     *
     * Public paths:
     * - GET /api/products/** → product catalog (read-only)
     * - GET /api/categories/** → category listing (read-only)
     * - /api/auth/** → login, register
     * - /health → health check
     */
    private boolean isPublicPath(String path, String method) {
        // GET requests to products and categories are public
        if ("GET".equals(method) && (path.startsWith("/api/products") || path.startsWith("/api/categories"))) {
            return true;
        }
        // Auth endpoints are always public
        if (path.startsWith("/api/auth/")) {
            return true;
        }
        // Health check
        return path.equals("/health");
    }

    @Override
    public int getOrder() {
        return -1; // Run before all other filters (except logging)
    }
}
