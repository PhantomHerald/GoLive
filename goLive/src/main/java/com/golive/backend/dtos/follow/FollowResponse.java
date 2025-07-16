package com.golive.backend.dtos.follow;

import lombok.Data;

@Data
public class FollowResponse {
    private Long id;
    private String followerUsername;
    private String followingUsername;
    private String followedAt; // format as ISO string or human-readable
}
