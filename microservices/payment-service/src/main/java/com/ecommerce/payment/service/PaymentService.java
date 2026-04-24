package com.ecommerce.payment.service;

import com.ecommerce.payment.dto.CreatePaymentRequest;
import com.ecommerce.payment.event.PaymentFailedEvent;
import com.ecommerce.payment.event.PaymentSuccessEvent;
import com.ecommerce.payment.kafka.PaymentEventProducer;
import com.ecommerce.payment.model.Payment;
import com.ecommerce.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentEventProducer paymentEventProducer;

    /**
     * Processes payment for an order.
     *
     * On success → publishes "payment-success" → Order Service updates to PAID
     * On failure → publishes "payment-failed" → Order Service updates to FAILED
     *                                         → Inventory Service rolls back stock
     */
    public Payment processPayment(CreatePaymentRequest request) {
        String transactionId = UUID.randomUUID().toString();

        // Create payment record
        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .userId(request.getUserId())
                .amount(BigDecimal.valueOf(0)) // Amount would come from order-service in real scenario
                .transactionId(transactionId)
                .status("pending")
                .build();

        payment = paymentRepository.save(payment);
        log.info("Payment created: {} for orderId={}", payment.getId(), request.getOrderId());

        // ── Simulate payment processing ──
        boolean paymentSucceeded = simulatePayment();

        if (paymentSucceeded) {
            payment.setStatus("succeeded");
            payment = paymentRepository.save(payment);

            // Publish payment-success → Order Service (PAID) 
            PaymentSuccessEvent successEvent = PaymentSuccessEvent.builder()
                    .paymentId(payment.getId())
                    .orderId(payment.getOrderId())
                    .amount(payment.getAmount())
                    .transactionId(payment.getTransactionId())
                    .build();

            paymentEventProducer.publishPaymentSuccess(successEvent);
            log.info("Payment succeeded for orderId={}", request.getOrderId());

        } else {
            payment.setStatus("failed");
            payment = paymentRepository.save(payment);

            // Publish payment-failed → Order Service (FAILED) + Inventory Service (rollback stock)
            PaymentFailedEvent failedEvent = PaymentFailedEvent.builder()
                    .paymentId(payment.getId())
                    .orderId(payment.getOrderId())
                    .amount(payment.getAmount())
                    .transactionId(payment.getTransactionId())
                    .reason("Payment processing failed")
                    .build();

            paymentEventProducer.publishPaymentFailed(failedEvent);
            log.warn("Payment failed for orderId={}", request.getOrderId());
        }

        return payment;
    }

    /**
     * Simulates payment — always succeeds for demo purposes.
     * In production, this would integrate with Stripe/Razorpay/PayPal.
     */
    private boolean simulatePayment() {
        try {
            Thread.sleep(500); // Simulate processing delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return true; // Always succeed in demo
    }
}
