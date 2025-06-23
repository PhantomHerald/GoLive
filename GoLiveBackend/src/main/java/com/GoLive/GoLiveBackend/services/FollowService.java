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

    public void followUser(Long followedId, String token) throws Exception {
        logger.info("User with token following user: {}", followedId);

        User follower = userService.validateToken(token);

        // Check if trying to follow self
        if (follower.getId().equals(followedId)) {
            throw new RuntimeException("Cannot follow yourself");
        }

        // Check if already following
        Optional<Follow> existingFollow = followRepository.findByFollowerAndFollowed(follower.getId(), followedId);
        if (existingFollow.isPresent()) {
            throw new RuntimeException("Already following this user");
        }

        // Get the user to follow
        User followed = userService.getUserById(followedId);

        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowed(followed);

        followRepository.save(follow);
        logger.info("User {} now following user {}", follower.getUsername(), followed.getUsername());
    }

    public void unfollowUser(Long followedId, String token) throws Exception {
        logger.info("User with token unfollowing user: {}", followedId);

        User follower = userService.validateToken(token);

        Optional<Follow> follow = followRepository.findByFollowerAndFollowed(follower.getId(), followedId);
        if (follow.isEmpty()) {
            throw new RuntimeException("Not following this user");
        }

        followRepository.delete(follow.get());
        logger.info("User {} unfollowed user {}", follower.getUsername(), followedId);
    }

    public List<User> getFollowedUsers(String token) throws Exception {
        logger.info("Getting followed users for user with token");

        User user = userService.validateToken(token);
        List<User> followedUsers = followRepository.findFollowedByFollowerId(user.getId());
        logger.info("Found {} followed users for user {}", followedUsers.size(), user.getUsername());
        return followedUsers;
    }

    public List<User> getFollowers(Long userId) {
        logger.info("Getting followers for user: {}", userId);
        List<User> followers = followRepository.findFollowersByFollowedId(userId);
        logger.info("Found {} followers for user {}", followers.size(), userId);
        return followers;
    }

    public boolean isFollowing(Long followedId, String token) throws Exception {
        logger.info("Checking if user with token is following user: {}", followedId);

        User follower = userService.validateToken(token);
        Optional<Follow> follow = followRepository.findByFollowerAndFollowed(follower.getId(), followedId);
        boolean isFollowing = follow.isPresent();
        logger.info("User {} is following user {}: {}", follower.getUsername(), followedId, isFollowing);
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
        Long count = followRepository.countFollowedByUserId(userId);
        logger.info("User {} is following {} users", userId, count);
        return count;
    }
}