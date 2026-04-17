package com.ecommerce.modules.order.repository;

import com.ecommerce.modules.order.model.Order;
import com.ecommerce.modules.order.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.isPaid = true")
    BigDecimal sumTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.isPaid = true")
    long countPaidOrders();

    boolean existsByUserIdAndStatusInAndItems_ProductId(Long userId, List<OrderStatus> statuses, Long productId);
}
