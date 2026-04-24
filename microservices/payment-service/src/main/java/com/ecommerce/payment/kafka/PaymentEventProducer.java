package com.ecommerce.payment.kafka;

import com.ecommerce.payment.event.PaymentFailedEvent;
import com.ecommerce.payment.event.PaymentSuccessEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentEventProducer {

    private static final String SUCCESS_TOPIC = "payment-success";
    private static final String FAILED_TOPIC = "payment-failed";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * Publishes a payment-success event to Kafka.
     */
    public void publishPaymentSuccess(PaymentSuccessEvent event) {
        log.info("Publishing payment-success event for orderId={}, paymentId={}",
                event.getOrderId(), event.getPaymentId());
        kafkaTemplate.send(SUCCESS_TOPIC, event.getOrderId(), event);
    }

    /**
     * Publishes a payment-failed event to Kafka.
     * Triggers:
     *   - Order Service → updates order status to FAILED
     *   - Inventory Service → rolls back reserved stock
     */
    public void publishPaymentFailed(PaymentFailedEvent event) {
        log.info("Publishing payment-failed event for orderId={}, reason={}",
                event.getOrderId(), event.getReason());
        kafkaTemplate.send(FAILED_TOPIC, event.getOrderId(), event);
    }
}
