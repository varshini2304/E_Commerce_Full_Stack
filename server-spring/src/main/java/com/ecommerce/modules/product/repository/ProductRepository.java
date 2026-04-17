package com.ecommerce.modules.product.repository;

import com.ecommerce.modules.product.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlugAndIsActiveTrue(String slug);

    boolean existsBySku(String sku);

    List<Product> findByCategorySlugAndIsActiveTrueAndIdNot(String categorySlug, Long id, Pageable pageable);

    List<Product> findByIsActiveTrueOrderByRatingsAverageDescSalesCountDesc(Pageable pageable);

    List<Product> findByIsActiveTrueOrderBySalesCountDescCreatedAtDesc(Pageable pageable);

    @Modifying
    @Query("UPDATE Product p SET p.views = p.views + 1 WHERE p.id = :id")
    void incrementViews(@Param("id") Long id);

    List<Product> findByIsActiveTrueAndStockLessThanEqual(Integer stock, Pageable pageable);

    long countByIsActiveTrue();
}
