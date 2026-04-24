package com.ecommerce.payment.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment implements Serializable {

    @Id
    private String id;

    @Indexed
    private String orderId;

    @Indexed
    private String userId;

    private BigDecimal amount;

    @Builder.Default
    private String provider = "demo";

    @Builder.Default
    private String status = "pending";

    @Indexed(unique = true)
    private String transactionId;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
