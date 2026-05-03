package com.ecommerce.vendor.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorResponse {

    private String id;
    private String name;
    private String email;
    private String businessName;
    private Boolean isVerified;
    private LocalDateTime createdAt;
}
