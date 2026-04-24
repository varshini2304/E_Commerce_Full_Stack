package com.ecommerce.payment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaymentRequest {

    @NotBlank(message = "Order ID is required")
    private String orderId;

    private String userId;
}
