package com.golive.backend.dtos.category;

import com.google.firebase.database.annotations.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link com.golive.backend.entities.Category}
 */

@Value
public class CategoryDto implements Serializable {
    Integer id;

    @NotNull
    @Size(max = 100)
    String name;

    String description;
}
