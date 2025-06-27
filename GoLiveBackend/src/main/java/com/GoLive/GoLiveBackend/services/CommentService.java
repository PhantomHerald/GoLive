package com.GoLive.GoLiveBackend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private static final Logger logger = LoggerFactory.getLogger(CommentService.class);

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private StreamRepository streamRepository;

    @Autowired
    private UserService userService;

    public Comment postComment(Long streamId, CommentRequest request, String token) throws Exception {
        logger.info("Posting comment on stream: {}", streamId);

        User user = userService.validateToken(token);
        Stream stream = streamRepository.findById(streamId)
                .orElseThrow(() -> new RuntimeException("Stream not found"));

        // Validate comment content
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new RuntimeException("Comment content cannot be empty");
        }

        Comment comment = new Comment();
        comment.setContent(request.getContent().trim());
        comment.setUser(user);
        comment.setStream(stream);

        Comment savedComment = commentRepository.save(comment);
        logger.info("Comment posted successfully: {}", savedComment.getId());

        return savedComment;
    }

    public List<Comment> getCommentsByStream(Long streamId) {
        logger.info("Getting comments for stream: {}", streamId);
        List<Comment> comments = commentRepository.findByStreamIdOrderByCreatedAtDesc(streamId);
        logger.info("Found {} comments for stream {}", comments.size(), streamId);
        return comments;
    }

    public List<Comment> getCommentsByStreamWithPagination(Long streamId, int page, int size) {
        logger.info("Getting comments for stream: {} with pagination (page: {}, size: {})", streamId, page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> commentPage = commentRepository.findByStreamIdOrderByCreatedAtDesc(streamId, pageable);
        logger.info("Found {} comments for stream {} (page {})", commentPage.getContent().size(), streamId, page);
        return commentPage.getContent();
    }

    public List<Comment> getCommentsByStreamWithLimit(Long streamId, int limit) {
        logger.info("Getting comments for stream: {} with limit: {}", streamId, limit);
        Pageable pageable = PageRequest.of(0, limit);
        List<Comment> comments = commentRepository.findCommentsByStreamIdWithLimit(streamId, pageable);
        logger.info("Found {} comments for stream {} (limited to {})", comments.size(), streamId, limit);
        return comments;
    }

    public Long getCommentCount(Long streamId) {
        logger.info("Getting comment count for stream: {}", streamId);
        Long count = commentRepository.countByStreamId(streamId);
        logger.info("Stream {} has {} comments", streamId, count);
        return count;
    }

    public void deleteComment(Long commentId, String token) throws Exception {
        logger.info("Deleting comment: {}", commentId);

        User user = userService.validateToken(token);
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Check if user owns the comment
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You can only delete your own comments");
        }

        commentRepository.delete(comment);
        logger.info("Comment deleted successfully: {}", commentId);
    }
}