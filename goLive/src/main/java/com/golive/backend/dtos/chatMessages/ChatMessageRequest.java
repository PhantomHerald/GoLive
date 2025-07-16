package com.golive.backend.dtos.chatMessages;

import lombok.Data;

@Data
public class ChatMessageRequest {
    private Long senderId;
    private Long streamId;
    private String content;
}
