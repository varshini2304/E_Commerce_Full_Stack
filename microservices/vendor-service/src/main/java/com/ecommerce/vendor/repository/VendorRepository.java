package com.ecommerce.vendor.repository;

import com.ecommerce.vendor.model.Vendor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorRepository extends MongoRepository<Vendor, String> {

    Optional<Vendor> findByEmail(String email);

    boolean existsByEmail(String email);
}
