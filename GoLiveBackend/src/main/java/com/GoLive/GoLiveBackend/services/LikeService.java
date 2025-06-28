package com.GoLive.GoLiveBackend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.GoLive.GoLiveBackend.entities.Like;
import com.GoLive.GoLiveBackend.repositories.LikeRepository;
import com.GoLive.GoLiveBackend.repositories.StreamRepository;
import com.GoLive.GoLiveBackend.entities.User;
import com.GoLive.GoLiveBackend.services.UserService;
import com.GoLive.GoLiveBackend.entities.Stream;

import java.util.Optional;

@Service
public class LikeService {

    private static final Logger logger = LoggerFactory.getLogger(LikeService.class);

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private StreamRepository streamRepository;

    @Autowired
    private UserService userService;

    public void likeStream(Long streamId, String token) throws Exception {
        logger.info("User with token liking stream: {}", streamId);

        User user = userService.validateToken(token);
        Stream stream = streamRepository.findById(streamId)
                .orElseThrow(() -> new RuntimeException("Stream not found"));

        // Check if already liked
        Optional<Like> existingLike = likeRepository.findByUserIdAndStreamId(user.getId(), streamId);
        if (existingLike.isPresent()) {
            throw new RuntimeException("Already liked this stream");
        }

        Like like = new Like();
        like.setUser(user);
        like.setStream(stream);

        likeRepository.save(like);
        logger.info("User {} liked stream {}", user.getUsername(), streamId);
    }

    public void unlikeStream(Long streamId, String token) throws Exception {
        logger.info("User with token unliking stream: {}", streamId);

        User user = userService.validateToken(token);

        Optional<Like> like = likeRepository.findByUserIdAndStreamId(user.getId(), streamId);
        if (like.isEmpty()) {
            throw new RuntimeException("Not liked this stream");
        }

        likeRepository.delete(like.get());
        logger.info("User {} unliked stream {}", user.getUsername(), streamId);
    }

    public Long getLikesCount(Long streamId) {
        logger.info("Getting likes count for stream: {}", streamId);
        Long count = likeRepository.countByStreamId(streamId);
        logger.info("Stream {} has {} likes", streamId, count);
        return count;
    }

    public boolean isLiked(Long streamId, String token) throws Exception {
        logger.info("Checking if user with token liked stream: {}", streamId);

        User user = userService.validateToken(token);
        Optional<Like> like = likeRepository.findByUserIdAndStreamId(user.getId(), streamId);
        boolean isLiked = like.isPresent();
        logger.info("User {} liked stream {}: {}", user.getUsername(), streamId, isLiked);
        return isLiked;
    }

    public Long getUserLikesCount(Long userId) {
        logger.info("Getting likes count for user: {}", userId);
        Long count = likeRepository.countByUserId(userId);
        logger.info("User {} has {} likes", userId, count);
        return count;
    }
}