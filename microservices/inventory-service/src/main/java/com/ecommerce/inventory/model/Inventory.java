package com.ecommerce.inventory.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Inventory document with optimistic locking via @Version.
 *
 * ─── Interview Point ───
 * "What if two orders come at the same time?"
 * → We use @Version for optimistic locking. If two concurrent updates try to
 *   modify the same document, one will get an OptimisticLockingFailureException
 *   and retry. Combined with atomic MongoDB $inc operations, this prevents
 *   overselling and race conditions.
 *
 * reservedStock vs availableStock:
 * → When order is created: availableStock ↓, reservedStock ↑
 * → When payment succeeds: reservedStock ↓ (stock permanently consumed)
 * → When payment fails: reservedStock ↓, availableStock ↑ (rollback)
 */
@Document(collection = "inventory")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Inventory implements Serializable {

    @Id
    private String id;

    @Indexed(unique = true)
    private String productId;

    @Builder.Default
    private Integer availableStock = 0;

    @Builder.Default
    private Integer reservedStock = 0;

    /**
     * Optimistic lock version — prevents concurrent modification issues.
     * MongoDB will reject updates if the version doesn't match.
     */
    @Version
    private Long version;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
