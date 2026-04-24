package com.ecommerce.product.repository;

import com.ecommerce.product.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    Optional<Product> findBySlugAndIsActiveTrue(String slug);

    boolean existsBySku(String sku);

    Page<Product> findByIsActiveTrue(Pageable pageable);

    Page<Product> findByCategorySlugAndIsActiveTrue(String categorySlug, Pageable pageable);

    List<Product> findByCategorySlugAndIsActiveTrueAndIdNot(String categorySlug, String id, Pageable pageable);

    Page<Product> findByIsActiveTrueAndNameContainingIgnoreCase(String name, Pageable pageable);

    List<Product> findByIsActiveTrueOrderByRatingsAverageDescSalesCountDesc(Pageable pageable);

    List<Product> findByIsActiveTrueOrderBySalesCountDescCreatedAtDesc(Pageable pageable);
}
