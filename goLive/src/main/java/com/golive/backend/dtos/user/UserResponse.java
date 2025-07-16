package com.golive.backend.dtos.user;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String profilePictureUrl;
    private String bio;
}
