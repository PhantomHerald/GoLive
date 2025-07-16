package com.golive.backend.mappers;

import com.golive.backend.dtos.category.CategoryDto;
import com.golive.backend.dtos.category.CategoryRequest;
import com.golive.backend.dtos.category.CategoryResponse;
import com.golive.backend.entities.Category;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper (componentModel = "spring")
public interface CategoryMapper {
    // From Entity to DTO
    CategoryDto toDto(Category category);
    List<CategoryDto> toDtoList(List<Category> categories);

    // From DTO to Entity
    Category toEntity(CategoryDto dto);

    // From Request to Entity
    Category toEntity(CategoryRequest request);

    // From Entity to Response
    CategoryResponse toResponse(Category category);
    List<CategoryResponse> toResponseList(List<Category> categories);
}
