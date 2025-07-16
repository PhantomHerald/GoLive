package com.golive.backend.dtos.user;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserRegistrationRequest {
    @NotNull
    private String username;

    @NotNull
    private String password;

    private String token;
}
