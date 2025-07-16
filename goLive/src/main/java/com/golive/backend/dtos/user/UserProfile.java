package com.golive.backend.dtos.user;

import lombok.Data;

@Data
public class UserProfile {
    private String username;
    private String bio;
    private String profilePictureUrl;
    private int followerCount;
    private int streamCount;
}
