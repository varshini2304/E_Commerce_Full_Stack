package com.ecommerce.payment.controller;

import com.ecommerce.payment.dto.CreatePaymentRequest;
import com.ecommerce.payment.model.Payment;
import com.ecommerce.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> processPayment(
            @Valid @RequestBody CreatePaymentRequest request) {
        Payment payment = paymentService.processPayment(request);
        
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Payment processed");
        response.put("data", payment);

        HttpStatus status = "succeeded".equals(payment.getStatus())
                ? HttpStatus.OK
                : HttpStatus.PAYMENT_REQUIRED;

        return ResponseEntity.status(status).body(response);
    }
}
