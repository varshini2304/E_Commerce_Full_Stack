package com.ecommerce.modules.order.repository;

import com.ecommerce.modules.order.model.Order;
import com.ecommerce.modules.order.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
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

    @Query("SELECT COUNT(o) > 0 FROM Order o JOIN o.items i " +
            "WHERE o.userId = :userId AND o.status IN :statuses AND i.productId = :productId")
    boolean existsByUserIdAndStatusInAndItems_ProductId(
            @Param("userId") Long userId,
            @Param("statuses") List<OrderStatus> statuses,
            @Param("productId") Long productId);
}
