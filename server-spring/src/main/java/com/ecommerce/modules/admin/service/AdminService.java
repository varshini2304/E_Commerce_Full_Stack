package com.ecommerce.modules.admin.service;

import com.ecommerce.modules.order.repository.OrderRepository;
import com.ecommerce.modules.product.model.Product;
import com.ecommerce.modules.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public Map<String, Object> getDashboardSummary() {
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();
        long totalOrders = orderRepository.countPaidOrders();
        long totalProducts = productRepository.countByIsActiveTrue();
        List<Product> lowStockProducts = productRepository.findByIsActiveTrueAndStockLessThanEqual(
                10, PageRequest.of(0, 10));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalRevenue", totalRevenue);
        result.put("totalOrders", totalOrders);
        result.put("totalProducts", totalProducts);
        result.put("lowStockProducts", lowStockProducts);
        return result;
    }
}
