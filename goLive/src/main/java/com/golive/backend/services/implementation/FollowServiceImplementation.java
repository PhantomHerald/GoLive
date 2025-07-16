package com.golive.backend.services.implementation;

import com.golive.backend.dtos.follow.FollowDTO;
import com.golive.backend.entities.Follow;
import com.golive.backend.mappers.FollowMapper;
import com.golive.backend.repositries.FollowRepository;
import com.golive.backend.services.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowServiceImplementation implements FollowService {
    private final FollowRepository followRepository;
    private final FollowMapper followMapper;

    @Override
    public FollowDTO createFollow(FollowDTO followDto) {
        Follow follow = followMapper.toEntity(followDto);
        return followMapper.toDto(followRepository.save(follow));
    }

    @Override
    public void deleteFollow(Integer followerId, Integer followingId) {
        followRepository.deleteByUserIdAndChannelId(followerId, followingId);
    }

    @Override
    public List<FollowDTO> getFollowers(Integer userId) {
        return followMapper.toDtoList(followRepository.findByChannelId(userId));
    }

    @Override
    public List<FollowDTO> getFollowing(Integer userId) {
        return followMapper.toDtoList(followRepository.findByUserId(userId));
    }
}
