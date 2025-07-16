package com.golive.backend.dtos.follow;

import lombok.Data;

@Data
public class FollowDTO {
    private int id;
    private int userId;
    private int followerId;
    private int followeeId;
    private String followeeName;
    private String followerName;

}
