package com.ecommerce.payment.event;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Event published to Kafka topic "payment-success" when payment succeeds.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSuccessEvent implements Serializable {

    private String paymentId;
    private String orderId;
    private BigDecimal amount;
    private String transactionId;
}
