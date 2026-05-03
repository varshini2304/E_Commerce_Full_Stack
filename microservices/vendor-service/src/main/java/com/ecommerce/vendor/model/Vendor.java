package com.ecommerce.vendor.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Vendor (Seller) document.
 *
 * ─── Design Notes ───
 * - Password is BCrypt hashed — never stored in plaintext.
 * - Email is unique-indexed for fast lookup during login.
 * - isVerified defaults to false — future admin approval workflow.
 */
@Document(collection = "vendors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vendor implements Serializable {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String businessName;

    @Builder.Default
    private Boolean isVerified = false;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
