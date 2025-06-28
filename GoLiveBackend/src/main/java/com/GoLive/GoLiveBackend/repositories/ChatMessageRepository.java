package com.GoLive.GoLiveBackend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.GoLive.GoLiveBackend.entities.ChatMessage;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    List<ChatMessage> findByStreamIdOrderByCreatedAtDesc(Long streamId);
    
    Page<ChatMessage> findByStreamIdOrderByCreatedAtDesc(Long streamId, Pageable pageable);
    
    @Query("SELECT c FROM ChatMessage c WHERE c.stream.id = :streamId AND c.messageType = :messageType ORDER BY c.createdAt DESC")
    List<ChatMessage> findByStreamIdAndMessageTypeOrderByCreatedAtDesc(@Param("streamId") Long streamId, @Param("messageType") ChatMessage.MessageType messageType);
    
    @Query("SELECT c FROM ChatMessage c WHERE c.stream.id = :streamId AND c.user.id = :userId ORDER BY c.createdAt DESC")
    List<ChatMessage> findByStreamIdAndUserIdOrderByCreatedAtDesc(@Param("streamId") Long streamId, @Param("userId") Long userId);
    
    Long countByStreamId(Long streamId);
    
    @Query("SELECT COUNT(c) FROM ChatMessage c WHERE c.stream.id = :streamId AND c.user.id = :userId")
    Long countByStreamIdAndUserId(@Param("streamId") Long streamId, @Param("userId") Long userId);
} 