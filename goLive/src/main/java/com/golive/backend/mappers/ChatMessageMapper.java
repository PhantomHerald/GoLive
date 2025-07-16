package com.golive.backend.mappers;

import com.golive.backend.dtos.chatMessages.ChatMessageResponse;
import com.golive.backend.entities.ChatMessage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper (componentModel = "spring")
public interface ChatMessageMapper {
    //@Mapping(source = "sender.username", target = "senderUsername")
    ChatMessageResponse toChatMessageResponse(ChatMessage chatMessage);
}
