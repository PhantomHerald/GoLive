package com.GoLive.GoLiveBackend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    // Get user's notifications with pagination
    @GetMapping
    public ResponseEntity<Page<Notification>> getNotifications(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            User user = userService.validateToken(token);
            
            Page<Notification> notifications = notificationService.getUserNotifications(user.getId(), page, size);
            logger.info("Retrieved {} notifications for user: {}", notifications.getContent().size(), user.getUsername());
            
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            logger.error("Error getting notifications", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // Get unread notifications
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            User user = userService.validateToken(token);
            
            List<Notification> notifications = notificationService.getUnreadNotifications(user.getId());
            logger.info("Retrieved {} unread notifications for user: {}", notifications.size(), user.getUsername());
            
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            logger.error("Error getting unread notifications", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // Get unread count
    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            User user = userService.validateToken(token);
            
            Long count = notificationService.getUnreadCount(user.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("unreadCount", count);
            
            logger.info("Unread count for user {}: {}", user.getUsername(), count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error getting unread count", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // Mark notification as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable Long notificationId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            User user = userService.validateToken(token);
            
            notificationService.markAsRead(notificationId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Notification marked as read");
            
            logger.info("Notification {} marked as read by user: {}", notificationId, user.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error marking notification as read", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // Mark all notifications as read
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            User user = userService.validateToken(token);
            
            notificationService.markAllAsRead(user.getId());
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "All notifications marked as read");
            
            logger.info("All notifications marked as read for user: {}", user.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error marking all notifications as read", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // Delete notification
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Map<String, String>> deleteNotification(
            @PathVariable Long notificationId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            User user = userService.validateToken(token);
            
            notificationService.deleteNotification(notificationId, user.getId());
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Notification deleted");
            
            logger.info("Notification {} deleted by user: {}", notificationId, user.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error deleting notification", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // Test endpoint to create a notification
    @PostMapping("/test")
    public ResponseEntity<Notification> createTestNotification(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> request) {
        try {
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            User user = userService.validateToken(token);
            
            String title = request.getOrDefault("title", "Test Notification");
            String message = request.getOrDefault("message", "This is a test notification");
            String type = request.getOrDefault("type", "SYSTEM_MESSAGE");
            
            Notification.NotificationType notificationType = Notification.NotificationType.valueOf(type);
            
            Notification notification = notificationService.createNotification(
                user.getId(), title, message, notificationType, null, null);
            
            logger.info("Test notification created for user: {}", user.getUsername());
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            logger.error("Error creating test notification", e);
            return ResponseEntity.badRequest().build();
        }
    }
} 