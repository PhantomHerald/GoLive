package com.GoLive.GoLiveBackend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.GoLive.GoLiveBackend.entities.Notification;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId, Pageable pageable);

    List<Notification> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(Long recipientId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipient.id = :recipientId AND n.isRead = false")
    Long countUnreadByRecipientId(@Param("recipientId") Long recipientId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipient.id = :recipientId")
    void markAllAsReadByRecipientId(@Param("recipientId") Long recipientId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :notificationId")
    void markAsReadById(@Param("notificationId") Long notificationId);

    @Query("SELECT n FROM Notification n WHERE n.recipient.id = :recipientId AND n.type = :type ORDER BY n.createdAt DESC")
    List<Notification> findByRecipientIdAndTypeOrderByCreatedAtDesc(@Param("recipientId") Long recipientId,
            @Param("type") Notification.NotificationType type);
}