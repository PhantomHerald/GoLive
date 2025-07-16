package com.golive.backend.repositries;

import com.golive.backend.entities.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Integer> {
    List<Follow> findByUserId(Integer userId);           // who a user is following
    List<Follow> findByChannelId(Integer channelId);     // followers of a channel
    void deleteByUserIdAndChannelId(Integer userId, Integer channelId);
}
