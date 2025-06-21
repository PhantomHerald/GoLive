package com.GoLive.GoLiveBackend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FollowService {

    private static final Logger logger = LoggerFactory.getLogger(FollowService.class);

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserService userService;

    public void followUser(Long followingId, String token) throws Exception {
        logger.info("User with token following user: {}", followingId);

        User follower = userService.validateToken(token);

        // Check if trying to follow self
        if (follower.getId().equals(followingId)) {
            throw new RuntimeException("Cannot follow yourself");
        }

        // Check if already following
        Optional<Follow> existingFollow = followRepository.findByFollowerAndFollowing(follower.getId(), followingId);
        if (existingFollow.isPresent()) {
            throw new RuntimeException("Already following this user");
        }

        // Get the user to follow
        User following = userService.getUserById(followingId);

        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowing(following);

        followRepository.save(follow);
        logger.info("User {} now following user {}", follower.getUsername(), following.getUsername());
    }

    public void unfollowUser(Long followingId, String token) throws Exception {
        logger.info("User with token unfollowing user: {}", followingId);

        User follower = userService.validateToken(token);

        Optional<Follow> follow = followRepository.findByFollowerAndFollowing(follower.getId(), followingId);
        if (follow.isEmpty()) {
            throw new RuntimeException("Not following this user");
        }

        followRepository.delete(follow.get());
        logger.info("User {} unfollowed user {}", follower.getUsername(), followingId);
    }

    public List<User> getFollowedUsers(String token) throws Exception {
        logger.info("Getting followed users for user with token");

        User user = userService.validateToken(token);
        List<User> followedUsers = followRepository.findFollowedUsersByFollowerId(user.getId());
        logger.info("Found {} followed users for user {}", followedUsers.size(), user.getUsername());
        return followedUsers;
    }

    public List<User> getFollowers(Long userId) {
        logger.info("Getting followers for user: {}", userId);
        List<User> followers = followRepository.findFollowersByFollowingId(userId);
        logger.info("Found {} followers for user {}", followers.size(), userId);
        return followers;
    }

    public boolean isFollowing(Long followingId, String token) throws Exception {
        logger.info("Checking if user with token is following user: {}", followingId);

        User follower = userService.validateToken(token);
        Optional<Follow> follow = followRepository.findByFollowerAndFollowing(follower.getId(), followingId);
        boolean isFollowing = follow.isPresent();
        logger.info("User {} is following user {}: {}", follower.getUsername(), followingId, isFollowing);
        return isFollowing;
    }

    public Long getFollowersCount(Long userId) {
        logger.info("Getting followers count for user: {}", userId);
        Long count = followRepository.countFollowersByUserId(userId);
        logger.info("User {} has {} followers", userId, count);
        return count;
    }

    public Long getFollowingCount(Long userId) {
        logger.info("Getting following count for user: {}", userId);
        Long count = followRepository.countFollowingByUserId(userId);
        logger.info("User {} is following {} users", userId, count);
        return count;
    }
}