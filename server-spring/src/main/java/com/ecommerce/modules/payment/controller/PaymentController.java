package com.ecommerce.modules.payment.controller;

import com.ecommerce.modules.payment.dto.CreatePaymentRequest;
import com.ecommerce.modules.payment.dto.VerifyPaymentRequest;
import com.ecommerce.modules.payment.model.Payment;
import com.ecommerce.modules.payment.service.PaymentService;
import com.ecommerce.modules.user.model.User;
import com.ecommerce.modules.user.repository.UserRepository;
import com.ecommerce.shared.exception.ResourceNotFoundException;
import com.ecommerce.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Payment>> createPayment(
            Authentication authentication,
            @Valid @RequestBody CreatePaymentRequest request
    ) {
        Long userId = getUserId(authentication);
        Payment data = paymentService.createPaymentIntent(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment intent created", data));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Payment>> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request
    ) {
        Payment data = paymentService.verifyPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified", data));
    }

    private Long getUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }
}
