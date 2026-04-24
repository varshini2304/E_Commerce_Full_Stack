package com.ecommerce.inventory.service;

import com.ecommerce.inventory.model.Inventory;
import com.ecommerce.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

/**
 * Inventory service with atomic MongoDB operations and optimistic locking.
 *
 * ─── Interview Point ───
 * "How do you handle concurrent stock updates?"
 * → We use two strategies:
 *   1. Atomic $inc operations via MongoTemplate (no read-modify-write race)
 *   2. @Version optimistic locking on the Inventory document
 *   3. @Retryable for automatic retry on OptimisticLockingFailureException
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final MongoTemplate mongoTemplate;

    /**
     * Get inventory for a product. Creates default entry if none exists.
     */
    public Inventory getInventory(String productId) {
        return inventoryRepository.findByProductId(productId)
                .orElseGet(() -> {
                    log.info("Creating default inventory entry for productId={}", productId);
                    Inventory inv = Inventory.builder()
                            .productId(productId)
                            .availableStock(0)
                            .reservedStock(0)
                            .build();
                    return inventoryRepository.save(inv);
                });
    }

    /**
     * Reserve stock when an order is created.
     * Uses atomic $inc to prevent race conditions.
     *
     * availableStock ↓ quantity
     * reservedStock  ↑ quantity
     */
    @Retryable(
            retryFor = OptimisticLockingFailureException.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 100, multiplier = 2)
    )
    public void reserveStock(String productId, int quantity) {
        // Ensure inventory record exists
        getInventory(productId);

        // Atomic update — no read-modify-write race condition
        Query query = Query.query(
                Criteria.where("productId").is(productId)
                        .and("availableStock").gte(quantity)  // Only if enough stock
        );
        Update update = new Update()
                .inc("availableStock", -quantity)
                .inc("reservedStock", quantity);

        var result = mongoTemplate.updateFirst(query, update, Inventory.class);

        if (result.getModifiedCount() == 0) {
            log.warn("Insufficient stock for productId={}. Requested: {}", productId, quantity);
        } else {
            log.info("Stock reserved for productId={}: quantity={}", productId, quantity);
        }
    }

    /**
     * Confirm reserved stock (payment succeeded).
     * reservedStock ↓ quantity (stock permanently consumed)
     */
    public void confirmReservation(String productId, int quantity) {
        Query query = Query.query(Criteria.where("productId").is(productId));
        Update update = new Update().inc("reservedStock", -quantity);

        mongoTemplate.updateFirst(query, update, Inventory.class);
        log.info("Reservation confirmed for productId={}: quantity={}", productId, quantity);
    }

    /**
     * Rollback reserved stock (payment failed).
     * reservedStock  ↓ quantity
     * availableStock ↑ quantity (stock returned to available pool)
     */
    @Retryable(
            retryFor = OptimisticLockingFailureException.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 100, multiplier = 2)
    )
    public void rollbackStock(String productId, int quantity) {
        Query query = Query.query(Criteria.where("productId").is(productId));
        Update update = new Update()
                .inc("reservedStock", -quantity)
                .inc("availableStock", quantity);

        mongoTemplate.updateFirst(query, update, Inventory.class);
        log.info("Stock rolled back for productId={}: quantity={}", productId, quantity);
    }

    /**
     * Set stock for a product (admin operation).
     */
    public Inventory setStock(String productId, int stock) {
        Inventory inventory = getInventory(productId);
        inventory.setAvailableStock(stock);
        return inventoryRepository.save(inventory);
    }
}
