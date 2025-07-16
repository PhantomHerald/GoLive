package com.golive.backend.dtos.category;

import lombok.Data;

@Data
public class CategoryResponse {
    private Integer id;
    private String name;
    private String description;

    private int streamCount;
}
