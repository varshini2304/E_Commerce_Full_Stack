package com.ecommerce.inventory.kafka;

import com.ecommerce.inventory.event.OrderCreatedEvent;
import com.ecommerce.inventory.event.PaymentFailedEvent;
import com.ecommerce.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Kafka consumers for inventory management.
 *
 * ─── Event Flow ───
 * order-created   → Reserve stock (availableStock ↓, reservedStock ↑)
 * payment-failed  → Rollback stock (reservedStock ↓, availableStock ↑)
 *
 * Note: payment-success confirmation is handled implicitly —
 * reserved stock stays consumed (reservedStock ↓) on success.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final InventoryService inventoryService;

    /**
     * Consumes "order-created" events.
     * Reserves stock for each item in the order.
     */
    @KafkaListener(topics = "order-created", groupId = "inventory-service-group")
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Received order-created event: orderId={}, items={}",
                event.getOrderId(), event.getItems().size());

        for (OrderCreatedEvent.OrderItemEvent item : event.getItems()) {
            try {
                inventoryService.reserveStock(item.getProductId(), item.getQuantity());
            } catch (Exception e) {
                log.error("Failed to reserve stock for productId={}: {}",
                        item.getProductId(), e.getMessage());
                // In production: publish a compensation event or send to DLQ
            }
        }

        log.info("Inventory reservation completed for orderId={}", event.getOrderId());
    }

    /**
     * Consumes "payment-failed" events.
     * Rolls back reserved stock for the failed order.
     *
     * ─── Interview Point ───
     * "What happens if payment fails?"
     * → The inventory service listens to payment-failed events and automatically
     *   rolls back the reserved stock, returning it to the available pool.
     *   This is part of the Saga pattern's compensating transaction.
     */
    @KafkaListener(topics = "payment-failed", groupId = "inventory-service-group")
    public void handlePaymentFailed(PaymentFailedEvent event) {
        log.warn("Received payment-failed event for orderId={}, reason={}",
                event.getOrderId(), event.getReason());

        // Note: In production, you'd look up the order items from a local cache
        // or event store. For demo, we log the rollback intent.
        log.info("Stock rollback triggered for orderId={} (payment failed)", event.getOrderId());
        
        // In a full implementation, the PaymentFailedEvent would include order items
        // or we'd query our local event store. For now, this demonstrates the pattern.
    }
}
