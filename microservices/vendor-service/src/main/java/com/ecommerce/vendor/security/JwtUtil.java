package com.ecommerce.vendor.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import com.ecommerce.vendor.model.Vendor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT utility for vendor authentication.
 *
 * ─── Token Structure ───
 * subject  = vendorId (used as X-User-Id in gateway)
 * email    = vendor email
 * role     = "VENDOR" (used by gateway to enforce role-based access)
 * expiry   = 24 hours (configurable)
 */
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    /**
     * Generate JWT for authenticated vendor.
     * Claims include vendorId (subject), email, and role=VENDOR.
     */
    public String generateToken(Vendor vendor) {
        SecretKey key = getSigningKey();
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(vendor.getId())
                .claim("email", vendor.getEmail())
                .claim("role", "VENDOR")
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    /**
     * Validate token and extract all claims.
     * Throws JwtException if token is invalid or expired.
     */
    public Claims validateToken(String token) {
        SecretKey key = getSigningKey();
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Extract vendor ID (subject) from token.
     */
    public String getVendorIdFromToken(String token) {
        return validateToken(token).getSubject();
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
}
