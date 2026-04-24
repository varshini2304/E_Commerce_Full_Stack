package com.ecommerce.payment.repository;

import com.ecommerce.payment.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {

    Optional<Payment> findByTransactionId(String transactionId);

    Optional<Payment> findByOrderId(String orderId);
}
