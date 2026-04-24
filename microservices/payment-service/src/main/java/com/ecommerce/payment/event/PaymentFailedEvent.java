package com.ecommerce.payment.event;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Event published to Kafka topic "payment-failed" when payment fails.
 * Consumed by:
 *   - Order Service → updates order status to FAILED
 *   - Inventory Service → rolls back reserved stock
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
