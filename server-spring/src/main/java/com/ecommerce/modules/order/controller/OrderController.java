package com.ecommerce.modules.order.controller;

import com.ecommerce.modules.order.dto.OrderStatusUpdateRequest;
import com.ecommerce.modules.order.model.Order;
import com.ecommerce.modules.order.service.OrderService;
import com.ecommerce.modules.user.model.User;
import com.ecommerce.modules.user.repository.UserRepository;
import com.ecommerce.shared.exception.ResourceNotFoundException;
import com.ecommerce.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(Authentication authentication) {
        Long userId = getUserId(authentication);
        Order data = orderService.createOrder(userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order created", data));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(Authentication authentication) {
        Long userId = getUserId(authentication);
        List<Order> data = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Orders fetched", data));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        List<Order> data = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success("All orders fetched", data));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request
    ) {
        Order data = orderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Order status updated", data));
    }

    private Long getUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }
}
