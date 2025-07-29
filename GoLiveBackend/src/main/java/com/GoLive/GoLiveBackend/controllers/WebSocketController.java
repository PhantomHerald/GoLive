package com.GoLive.GoLiveBackend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import com.GoLive.GoLiveBackend.entities.Stream;
import com.GoLive.GoLiveBackend.services.StreamService;
import java.util.Map;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private StreamService streamService;

    @MessageMapping("/streams/subscribe")
    @SendTo("/topic/streams")
    public String subscribeToStreams(@RequestBody Map<String, Object> message) {
        System.out.println("Client subscribed to stream updates: " + message);
        return "Subscribed to stream updates";
    }

    // Method to notify clients when a stream starts
    public void notifyStreamStarted(Stream stream) {
        try {
            Map<String, Object> notification = Map.of(
                    "type", "stream_started",
                    "streamId", stream.getId().toString(),
                    "streamerUsername", stream.getStreamer().getUsername(),
                    "streamerDisplayName", stream.getStreamer().getDisplayName(),
                    "title", stream.getTitle() != null ? stream.getTitle() : "",
                    "timestamp", System.currentTimeMillis());

            messagingTemplate.convertAndSend("/topic/streams", notification);
            System.out.println("📡 Stream started notification sent: " + stream.getId());
        } catch (Exception e) {
            System.err.println("❌ Error sending stream started notification: " + e.getMessage());
        }
    }

    // Method to notify clients when a stream ends
    public void notifyStreamEnded(Stream stream) {
        try {
            Map<String, Object> notification = Map.of(
                    "type", "stream_ended",
                    "streamId", stream.getId().toString(),
                    "streamerUsername", stream.getStreamer().getUsername(),
                    "streamerDisplayName", stream.getStreamer().getDisplayName(),
                    "title", stream.getTitle() != null ? stream.getTitle() : "",
                    "timestamp", System.currentTimeMillis());

            messagingTemplate.convertAndSend("/topic/streams", notification);
            System.out.println("📡 Stream ended notification sent: " + stream.getId());
        } catch (Exception e) {
            System.err.println("❌ Error sending stream ended notification: " + e.getMessage());
        }
    }
}