package com.ecommerce.order.event;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Event consumed from Kafka topic "payment-failed".
 * Triggers order status update to FAILED.
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
