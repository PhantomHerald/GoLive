package com.GoLive.GoLiveBackend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.*;
import com.GoLive.GoLiveBackend.services.ChatService;
import com.GoLive.GoLiveBackend.entities.ChatMessage;
import com.GoLive.GoLiveBackend.dtos.ChatMessageDTO;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    // WebSocket endpoint for sending chat messages
    @MessageMapping("/stream/{streamId}/chat")
    @SendTo("/topic/stream/{streamId}/chat")
    public ChatMessageDTO sendMessage(@Payload ChatMessageDTO chatMessageDTO,
                                      @PathVariable Long streamId,
                                      SimpMessageHeaderAccessor headerAccessor) throws Exception {
        String token = (String) headerAccessor.getSessionAttributes().get("token");
        ChatMessage saved = chatService.saveAndBroadcastMessage(streamId, chatMessageDTO.getContent(), token);
        return toDTO(saved);
    }

    // REST endpoint to get recent chat messages
    @GetMapping("/stream/{streamId}/recent")
    public List<ChatMessageDTO> getRecentMessages(@PathVariable Long streamId,
                                                  @RequestParam(defaultValue = "20") int limit) {
        return chatService.getRecentMessages(streamId, limit).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private ChatMessageDTO toDTO(ChatMessage msg) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(msg.getId());
        dto.setContent(msg.getContent());
        dto.setUsername(msg.getUser().getUsername());
        dto.setUserId(msg.getUser().getId());
        dto.setStreamId(msg.getStream().getId());
        dto.setMessageType(msg.getMessageType().name());
        dto.setCreatedAt(msg.getCreatedAt());
        return dto;
    }
} 