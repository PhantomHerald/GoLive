package com.golive.backend.services.implementation;

import com.golive.backend.dtos.category.CategoryDto;
import com.golive.backend.dtos.category.CategoryRequest;
import com.golive.backend.entities.Category;
import com.golive.backend.mappers.CategoryMapper;
import com.golive.backend.repositries.CategoryRepository;
import com.golive.backend.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImplementation implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public CategoryDto createCategory(CategoryRequest request) {
        Category category = categoryMapper.toEntity(request);
        return categoryMapper.toDto(categoryRepository.save(category));
    }

    @Override
    public List<CategoryDto> getAllCategories() {
        return categoryMapper.toDtoList(categoryRepository.findAll());
    }

    @Override
    public CategoryDto getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return categoryMapper.toDto(category);
    }

    @Override
    public CategoryDto updateCategory(Integer id, CategoryDto categoryDto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());

        Category updated = categoryRepository.save(category);
        return categoryMapper.toDto(updated);
    }
    @Override
    public void deleteCategory(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }
        categoryRepository.deleteById(id);
    }

    @Override
    public CategoryDto createCategory(CategoryDto categoryDto) {
        Category category = categoryMapper.toEntity(categoryDto);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toDto(saved);
    }

}
