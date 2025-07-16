package com.golive.backend.dtos.user;

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
    private Integer id;

    @NotNull
    @Size(max = 50)
    private String username;

    @NotNull
    @Size(max = 100)
    private String email;

    @Size(max = 100)
    private String displayName;

    @Size(max = 255)
    private String avatarUrl;

    private String bio;

    private Instant createdAt;
}