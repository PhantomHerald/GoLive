package com.golive.backend.dtos.chatMessages;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private String senderUsername;
    private String content;
    private String sentAt;
}
