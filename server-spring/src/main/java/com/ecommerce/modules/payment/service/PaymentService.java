package com.ecommerce.modules.payment.service;

import com.ecommerce.modules.order.model.Order;
import com.ecommerce.modules.order.model.PaymentStatus;
import com.ecommerce.modules.order.repository.OrderRepository;
import com.ecommerce.modules.payment.dto.CreatePaymentRequest;
import com.ecommerce.modules.payment.dto.VerifyPaymentRequest;
import com.ecommerce.modules.payment.model.Payment;
import com.ecommerce.modules.payment.repository.PaymentRepository;
import com.ecommerce.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public Payment createPaymentIntent(Long userId, CreatePaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .filter(o -> o.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        Payment payment = Payment.builder()
                .orderId(order.getId())
                .userId(userId)
                .amount(order.getTotal())
                .transactionId(UUID.randomUUID().toString())
                .status("pending")
                .build();

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment verifyPayment(VerifyPaymentRequest request) {
        Payment payment = paymentRepository.findByTransactionId(request.getTransactionId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        payment.setStatus(request.getStatus());
        paymentRepository.save(payment);

        boolean isPaid = "succeeded".equals(request.getStatus());
        Order order = orderRepository.findById(payment.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setPaymentStatus(isPaid ? PaymentStatus.PAID : PaymentStatus.FAILED);
        order.setIsPaid(isPaid);
        orderRepository.save(order);

        return payment;
    }
}
