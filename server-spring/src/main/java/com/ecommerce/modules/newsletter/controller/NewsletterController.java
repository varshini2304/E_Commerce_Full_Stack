package com.ecommerce.modules.newsletter.controller;

import com.ecommerce.modules.newsletter.dto.NewsletterRequest;
import com.ecommerce.shared.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {

    @PostMapping("/subscribe")
    public ResponseEntity<ApiResponse<Map<String, String>>> subscribe(
            @Valid @RequestBody NewsletterRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Subscription received", Map.of("email", request.getEmail())));
    }
}
