package com.GoLive.GoLiveBackend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private StreamRepository streamRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ChatMessage saveAndBroadcastMessage(Long streamId, String content, String token) throws Exception {
        User user = userService.validateToken(token);
        Stream stream = streamRepository.findById(streamId)
                .orElseThrow(() -> new RuntimeException("Stream not found"));

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContent(content);
        chatMessage.setUser(user);
        chatMessage.setStream(stream);
        chatMessage.setMessageType(ChatMessage.MessageType.CHAT);

        ChatMessage saved = chatMessageRepository.save(chatMessage);
        logger.info("Chat message saved: {}", saved.getId());

        // Broadcast to all subscribers of the stream
        messagingTemplate.convertAndSend("/topic/stream/" + streamId + "/chat", saved);
        return saved;
    }

    public List<ChatMessage> getRecentMessages(Long streamId, int limit) {
        return chatMessageRepository.findByStreamIdOrderByCreatedAtDesc(streamId)
                .stream().limit(limit).toList();
    }
}