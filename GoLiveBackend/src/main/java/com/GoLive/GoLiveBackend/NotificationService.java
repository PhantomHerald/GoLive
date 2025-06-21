package com.GoLive.GoLiveBackend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    // Create and send notification to a single user
    public Notification createNotification(Long recipientId, String title, String message,
            Notification.NotificationType type, Long senderId, String data) {
        try {
            User recipient = userService.getUserById(recipientId);
            User sender = senderId != null ? userService.getUserById(senderId) : null;

            Notification notification = new Notification();
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setType(type);
            notification.setRecipient(recipient);
            notification.setSender(sender);
            notification.setData(data);

            Notification saved = notificationRepository.save(notification);
            logger.info("Notification created: {} for user: {}", saved.getId(), recipient.getUsername());

            // Send real-time notification via WebSocket
            sendRealTimeNotification(recipientId, saved);

            return saved;
        } catch (Exception e) {
            logger.error("Error creating notification", e);
            return null;
        }
    }

    // Notify followers when streamer goes live
    public void notifyStreamLive(Long streamerId, String streamTitle, Long streamId) {
        try {
            List<User> followers = followRepository.findFollowersByFollowingId(streamerId);
            User streamer = userService.getUserById(streamerId);

            String title = streamer.getUsername() + " is now live!";
            String message = streamer.getUsername() + " just went live: " + streamTitle;

            Map<String, Object> data = new HashMap<>();
            data.put("streamId", streamId);
            data.put("streamerId", streamerId);
            data.put("streamTitle", streamTitle);

            String dataJson = objectMapper.writeValueAsString(data);

            for (User follower : followers) {
                createNotification(follower.getId(), title, message,
                        Notification.NotificationType.STREAM_LIVE, streamerId, dataJson);
            }

            logger.info("Stream live notifications sent to {} followers", followers.size());
        } catch (Exception e) {
            logger.error("Error notifying stream live", e);
        }
    }

    // Notify when someone follows
    public void notifyNewFollower(Long followerId, Long followingId) {
        try {
            User follower = userService.getUserById(followerId);
            User following = userService.getUserById(followingId);

            String title = "New Follower!";
            String message = follower.getUsername() + " started following you";

            createNotification(followingId, title, message,
                    Notification.NotificationType.NEW_FOLLOWER, followerId, null);
        } catch (Exception e) {
            logger.error("Error notifying new follower", e);
        }
    }

    // Notify when stream ends
    public void notifyStreamEnded(Long streamerId, String streamTitle, Long streamId) {
        try {
            List<User> followers = followRepository.findFollowersByFollowingId(streamerId);
            User streamer = userService.getUserById(streamerId);

            String title = streamer.getUsername() + " ended their stream";
            String message = streamer.getUsername() + " just ended: " + streamTitle;

            Map<String, Object> data = new HashMap<>();
            data.put("streamId", streamId);
            data.put("streamerId", streamerId);

            String dataJson = objectMapper.writeValueAsString(data);

            for (User follower : followers) {
                createNotification(follower.getId(), title, message,
                        Notification.NotificationType.STREAM_ENDED, streamerId, dataJson);
            }

            logger.info("Stream ended notifications sent to {} followers", followers.size());
        } catch (Exception e) {
            logger.error("Error notifying stream ended", e);
        }
    }

    // Notify streamer when someone comments
    public void notifyNewComment(Long streamerId, Long commenterId, String commentContent, Long streamId) {
        try {
            User commenter = userService.getUserById(commenterId);
            User streamer = userService.getUserById(streamerId);

            String title = "New Comment";
            String message = commenter.getUsername() + " commented: " +
                    (commentContent.length() > 50 ? commentContent.substring(0, 50) + "..." : commentContent);

            Map<String, Object> data = new HashMap<>();
            data.put("streamId", streamId);
            data.put("commenterId", commenterId);

            String dataJson = objectMapper.writeValueAsString(data);

            createNotification(streamerId, title, message,
                    Notification.NotificationType.NEW_COMMENT, commenterId, dataJson);
        } catch (Exception e) {
            logger.error("Error notifying new comment", e);
        }
    }

    // Notify streamer when someone likes their stream
    public void notifyNewLike(Long streamerId, Long likerId, Long streamId) {
        try {
            User liker = userService.getUserById(likerId);
            User streamer = userService.getUserById(streamerId);

            String title = "New Like";
            String message = liker.getUsername() + " liked your stream";

            Map<String, Object> data = new HashMap<>();
            data.put("streamId", streamId);
            data.put("likerId", likerId);

            String dataJson = objectMapper.writeValueAsString(data);

            createNotification(streamerId, title, message,
                    Notification.NotificationType.NEW_LIKE, likerId, dataJson);
        } catch (Exception e) {
            logger.error("Error notifying new like", e);
        }
    }

    // Get user's notifications with pagination
    public Page<Notification> getUserNotifications(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId, pageable);
    }

    // Get user's unread notifications
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    // Get unread count
    public Long getUnreadCount(Long userId) {
        return notificationRepository.countUnreadByRecipientId(userId);
    }

    // Mark notification as read
    public void markAsRead(Long notificationId) {
        notificationRepository.markAsReadById(notificationId);
        logger.info("Notification marked as read: {}", notificationId);
    }

    // Mark all notifications as read
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByRecipientId(userId);
        logger.info("All notifications marked as read for user: {}", userId);
    }

    // Delete notification
    public void deleteNotification(Long notificationId, Long userId) throws Exception {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getRecipient().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You can only delete your own notifications");
        }

        notificationRepository.delete(notification);
        logger.info("Notification deleted: {}", notificationId);
    }

    // Send real-time notification via WebSocket
    private void sendRealTimeNotification(Long userId, Notification notification) {
        try {
            Map<String, Object> notificationData = new HashMap<>();
            notificationData.put("id", notification.getId());
            notificationData.put("title", notification.getTitle());
            notificationData.put("message", notification.getMessage());
            notificationData.put("type", notification.getType().name());
            notificationData.put("isRead", notification.isRead());
            notificationData.put("createdAt", notification.getCreatedAt());
            notificationData.put("data", notification.getData());

            if (notification.getSender() != null) {
                notificationData.put("senderUsername", notification.getSender().getUsername());
                notificationData.put("senderId", notification.getSender().getId());
            }

            messagingTemplate.convertAndSend("/queue/user/" + userId + "/notifications", notificationData);
            logger.info("Real-time notification sent to user: {}", userId);
        } catch (Exception e) {
            logger.error("Error sending real-time notification", e);
        }
    }
}