package com.golive.backend.services;

import com.golive.backend.dtos.follow.FollowDTO;

import java.util.List;

public interface FollowService {
    FollowDTO createFollow(FollowDTO followDto);
    void deleteFollow(Integer followerId, Integer followingId);
    List<FollowDTO> getFollowers(Integer userId);
    List<FollowDTO> getFollowing(Integer userId);
}
