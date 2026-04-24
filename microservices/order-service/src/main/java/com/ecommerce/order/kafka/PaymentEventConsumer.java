package com.ecommerce.order.kafka;

import com.ecommerce.order.event.PaymentFailedEvent;
import com.ecommerce.order.event.PaymentSuccessEvent;
import com.ecommerce.order.model.Order;
import com.ecommerce.order.model.OrderStatus;
import com.ecommerce.order.model.PaymentStatus;
import com.ecommerce.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Kafka consumers for payment events.
 *
 * payment-success → Order status = PAID
 * payment-failed  → Order status = CANCELLED, paymentStatus = FAILED
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentEventConsumer {

    private final OrderRepository orderRepository;

    /**
     * Handles successful payment.
     * Updates order paymentStatus to PAID and isPaid to true.
     */
    @KafkaListener(topics = "payment-success", groupId = "order-service-group")
    public void handlePaymentSuccess(PaymentSuccessEvent event) {
        log.info("Received payment-success event for orderId={}, paymentId={}",
                event.getOrderId(), event.getPaymentId());

        orderRepository.findById(event.getOrderId()).ifPresentOrElse(order -> {
            order.setPaymentStatus(PaymentStatus.PAID);
            order.setIsPaid(true);
            orderRepository.save(order);
            log.info("Order {} updated to PAID status", event.getOrderId());
        }, () -> {
            log.warn("Order {} not found for payment-success event", event.getOrderId());
        });
    }

    /**
     * Handles failed payment.
     * Updates order paymentStatus to FAILED and status to CANCELLED.
     * This is the compensating transaction for the Saga pattern.
     */
    @KafkaListener(topics = "payment-failed", groupId = "order-service-group")
    public void handlePaymentFailed(PaymentFailedEvent event) {
        log.warn("Received payment-failed event for orderId={}, reason={}",
                event.getOrderId(), event.getReason());

        orderRepository.findById(event.getOrderId()).ifPresentOrElse(order -> {
            order.setPaymentStatus(PaymentStatus.FAILED);
            order.setStatus(OrderStatus.CANCELLED);
            order.setIsPaid(false);
            orderRepository.save(order);
            log.info("Order {} updated to CANCELLED (payment failed)", event.getOrderId());
        }, () -> {
            log.warn("Order {} not found for payment-failed event", event.getOrderId());
        });
    }
}
