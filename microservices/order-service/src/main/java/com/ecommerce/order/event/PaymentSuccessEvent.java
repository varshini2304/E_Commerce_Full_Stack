package com.ecommerce.order.event;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Event consumed from Kafka topic "payment-success".
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
