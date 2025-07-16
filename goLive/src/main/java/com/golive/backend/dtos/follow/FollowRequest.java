package com.golive.backend.dtos.follow;

import lombok.Data;

@Data
public class FollowRequest {
    private String follower_id;
    private String followee_id;
}
