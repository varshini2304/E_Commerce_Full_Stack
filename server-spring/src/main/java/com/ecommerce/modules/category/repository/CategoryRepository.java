package com.ecommerce.modules.category.repository;

import com.ecommerce.modules.category.model.Category;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByIsActiveTrue(Pageable pageable);

    List<Category> findByIsActiveTrue();
}
