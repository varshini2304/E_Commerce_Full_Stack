package com.ecommerce.modules.profile.service;

import com.ecommerce.modules.order.model.Order;
import com.ecommerce.modules.order.repository.OrderRepository;
import com.ecommerce.modules.user.model.Role;
import com.ecommerce.modules.user.model.User;
import com.ecommerce.modules.user.repository.UserRepository;
import com.ecommerce.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Profile page service — mirrors Node.js profilePageService.js getProfilePageData().
 */
@Service
@RequiredArgsConstructor
public class ProfilePageService {

    private static final String DEFAULT_AVATAR_URL = "https://picsum.photos/seed/profile-avatar/220/220";

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public Map<String, Object> getProfilePageData(String email) {
        User user;
        if (email != null && !email.isBlank()) {
            user = userRepository.findByEmail(email.toLowerCase())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        } else {
            user = userRepository.findFirstByRoleOrderByCreatedAtAsc(Role.ROLE_CUSTOMER)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        }

        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        Map<String, Object> userMap = new LinkedHashMap<>();
        userMap.put("id", user.getId());
        userMap.put("name", user.getName());
        userMap.put("email", user.getEmail());
        userMap.put("avatarUrl", DEFAULT_AVATAR_URL);

        List<Map<String, Object>> orderList = new ArrayList<>();
        for (Order order : orders) {
            Map<String, Object> o = new LinkedHashMap<>();
            o.put("id", order.getId());
            o.put("orderNumber", String.valueOf(order.getId()).substring(
                    Math.max(0, String.valueOf(order.getId()).length() - 5)).toUpperCase());
            o.put("status", order.getStatus().name().toLowerCase());
            o.put("subtotal", order.getSubtotal());
            o.put("total", order.getTotal());
            o.put("createdAt", order.getCreatedAt());

            List<Map<String, Object>> items = new ArrayList<>();
            order.getItems().forEach(item -> {
                Map<String, Object> i = new LinkedHashMap<>();
                i.put("productId", item.getProductId());
                i.put("name", item.getName());
                i.put("thumbnail", item.getThumbnail());
                i.put("quantity", item.getQuantity());
                i.put("price", item.getPrice());
                items.add(i);
            });
            o.put("items", items);
            orderList.add(o);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("user", userMap);
        result.put("orders", orderList);
        return result;
    }
}
