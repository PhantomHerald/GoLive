package com.golive.backend.services;

import com.golive.backend.dtos.category.CategoryDto;
import com.golive.backend.dtos.category.CategoryRequest;

import java.util.List;

public interface CategoryService {
    CategoryDto createCategory(CategoryRequest request);
    List<CategoryDto> getAllCategories();
    CategoryDto getCategoryById(Integer id);
    CategoryDto updateCategory(Integer id, CategoryDto categoryDto);
    void deleteCategory(Integer id);
    CategoryDto createCategory(CategoryDto categoryDto);
}
