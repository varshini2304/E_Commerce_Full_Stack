package com.ecommerce.modules.category.service;

import com.ecommerce.modules.category.dto.CategoryRequest;
import com.ecommerce.modules.category.model.Category;
import com.ecommerce.modules.category.repository.CategoryRepository;
import com.ecommerce.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findByIsActiveTrue();
    }

    @CacheEvict(value = "home", allEntries = true)
    public Category createCategory(CategoryRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .icon(request.getIcon())
                .image(request.getImage())
                .description(request.getDescription() != null ? request.getDescription() : "")
                .build();
        return categoryRepository.save(category);
    }

    @CacheEvict(value = "home", allEntries = true)
    public Category updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setIcon(request.getIcon());
        category.setImage(request.getImage());
        if (request.getDescription() != null) category.setDescription(request.getDescription());
        return categoryRepository.save(category);
    }
}
