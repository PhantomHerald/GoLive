package com.golive.backend.dtos.stream;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.golive.backend.entities.Channel}
 */
@Value
public class ChannelDto implements Serializable {
    Integer id;
    @NotNull
    @Size(max = 100)
    String name;
    String description;
    Instant createdAt;
}