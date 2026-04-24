package com.ecommerce.product.service;

import com.ecommerce.product.dto.CategoryRequest;
import com.ecommerce.product.dto.CategoryResponse;
import com.ecommerce.product.exception.ConflictException;
import com.ecommerce.product.exception.ResourceNotFoundException;
import com.ecommerce.product.model.Category;
import com.ecommerce.product.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Cacheable(value = "categories")
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findByIsActiveTrue()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return toResponse(category);
    }

    @CacheEvict(value = "categories", allEntries = true)
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsBySlug(request.getSlug())) {
            throw new ConflictException("Category slug already exists");
        }

        Category category = Category.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .icon(request.getIcon())
                .image(request.getImage())
                .description(request.getDescription() != null ? request.getDescription() : "")
                .build();

        category = categoryRepository.save(category);
        log.info("Category created: {} (slug: {})", category.getName(), category.getSlug());
        return toResponse(category);
    }

    @CacheEvict(value = "categories", allEntries = true)
    public CategoryResponse updateCategory(String id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setIcon(request.getIcon());
        category.setImage(request.getImage());
        if (request.getDescription() != null) category.setDescription(request.getDescription());

        category = categoryRepository.save(category);
        log.info("Category updated: {} (ID: {})", category.getName(), category.getId());
        return toResponse(category);
    }

    @CacheEvict(value = "categories", allEntries = true)
    public void deleteCategory(String id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setIsActive(false);
        categoryRepository.save(category);
        log.info("Category soft-deleted: {} (ID: {})", category.getName(), id);
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .icon(category.getIcon())
                .image(category.getImage())
                .description(category.getDescription())
                .isActive(category.getIsActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
