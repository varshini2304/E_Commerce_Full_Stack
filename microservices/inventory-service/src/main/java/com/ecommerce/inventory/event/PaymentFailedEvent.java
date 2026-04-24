package com.ecommerce.inventory.event;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Mirrors the PaymentFailedEvent published by payment-service.
 * Used to rollback inventory stock when payment fails.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentFailedEvent implements Serializable {

    private String paymentId;
    private String orderId;
    private BigDecimal amount;
    private String transactionId;
    private String reason;
}
