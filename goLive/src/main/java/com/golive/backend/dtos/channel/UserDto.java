package com.golive.backend.dtos.channel;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.golive.backend.entities.User}
 */
@Value
public class UserDto implements Serializable {
    Integer id;
    @NotNull
    @Size(max = 50)
    String username;
    @NotNull
    @Size(max = 100)
    String email;
    @NotNull
    String passwordHash;
    Instant createdAt;
}