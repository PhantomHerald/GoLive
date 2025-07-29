package com.GoLive.GoLiveBackend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.GoLive.GoLiveBackend.services.StreamService;
import com.GoLive.GoLiveBackend.entities.Stream;
import com.GoLive.GoLiveBackend.dtos.StreamRequest;
import com.GoLive.GoLiveBackend.dtos.StreamDTO;
import com.GoLive.GoLiveBackend.controllers.WebSocketController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/streams")
public class StreamController {

    @Autowired
    private StreamService streamService;

    @Autowired
    private WebSocketController webSocketController;

    @Value("${mux.accessToken:9d2072eb-88d1-413a-bb0b-300852912600}")
    private String muxAccessToken;
    @Value("${mux.secretKey:k0HUYhgUZX8UBFC/8Ke5nxVhyfEstAJs1qqJNNUeOksj7P49hvZgknvo5f2luFoKfqzL1lrEfGc}")
    private String muxSecretKey;

    @GetMapping
    public List<StreamDTO> getAllStreams() {
        return streamService.getLiveStreams();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Stream> getStreamById(@PathVariable Long id) {
        try {
            Stream stream = streamService.getStreamById(id);
            return ResponseEntity.ok(stream);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public List<Stream> getStreamsByUserId(@PathVariable Long userId) {
        return streamService.getStreamsByStreamer(userId);
    }

    @GetMapping("/category/{category}")
    public List<Stream> getStreamsByCategory(@PathVariable String category) {
        return streamService.getStreamsByCategory(category);
    }

    @GetMapping("/live")
    public List<StreamDTO> getLiveStreams() {
        return streamService.getLiveStreams();
    }

    @PostMapping
    public ResponseEntity<Stream> createStream(@RequestBody StreamRequest streamRequest,
            @RequestHeader("Authorization") String token) {
        try {
            Stream createdStream = streamService.createStream(streamRequest, token);
            return ResponseEntity.ok(createdStream);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Stream> updateStream(@PathVariable Long id, @RequestBody StreamRequest streamRequest,
            @RequestHeader("Authorization") String token) {
        try {
            Stream updatedStream = streamService.updateStream(id, streamRequest, token);
            return ResponseEntity.ok(updatedStream);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStream(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            streamService.deleteStream(id, token);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/go-live")
    public ResponseEntity<Stream> goLive(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            Stream stream = streamService.goLive(id, token);

            // Send WebSocket notification that stream started
            webSocketController.notifyStreamStarted(stream);

            return ResponseEntity.ok(stream);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/end-stream")
    public ResponseEntity<Stream> endStream(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            Stream stream = streamService.endStream(id, token);

            // Send WebSocket notification that stream ended
            webSocketController.notifyStreamEnded(stream);

            return ResponseEntity.ok(stream);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/mux")
    public ResponseEntity<?> createMuxStream(@RequestHeader("Authorization") String token,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            // 1. Call MUX API to create a live stream
            RestTemplate restTemplate = new RestTemplate();
            String muxUrl = "https://api.mux.com/video/v1/live-streams";
            String auth = muxAccessToken + ":" + muxSecretKey;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());

            Map<String, Object> muxRequest = Map.of(
                    "playback_policy", new String[] { "public" },
                    "new_asset_settings", Map.of("playback_policy", new String[] { "public" }));

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Basic " + encodedAuth);

            org.springframework.http.HttpEntity<Map<String, Object>> entity = new org.springframework.http.HttpEntity<>(
                    muxRequest, headers);
            ResponseEntity<Map> muxResponse = restTemplate.postForEntity(muxUrl, entity, Map.class);
            if (!muxResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("MUX API error");
            }
            Map data = (Map) muxResponse.getBody().get("data");
            String streamKey = (String) data.get("stream_key");
            String muxStreamId = (String) data.get("id");
            String muxPlaybackId = null;
            if (data.get("playback_ids") instanceof java.util.List list && !list.isEmpty()) {
                muxPlaybackId = (String) ((Map) list.get(0)).get("id");
            }

            // 2. Store in DB
            com.GoLive.GoLiveBackend.entities.Stream stream = new com.GoLive.GoLiveBackend.entities.Stream();
            stream.setStreamKey(streamKey);
            stream.setMuxStreamId(muxStreamId);
            stream.setMuxPlaybackId(muxPlaybackId);
            stream.setMuxStatus("idle");
            // Optionally set title, description, etc. from body
            if (body != null) {
                if (body.containsKey("title"))
                    stream.setTitle(body.get("title"));
                if (body.containsKey("description"))
                    stream.setDescription(body.get("description"));
                if (body.containsKey("category"))
                    stream.setCategory(body.get("category"));
            }
            // Get user from token
            com.GoLive.GoLiveBackend.entities.User user = streamService.getUserFromToken(token);
            stream.setStreamer(user);
            stream.setLive(false);
            Stream savedStream = streamService.saveStream(stream);

            // 3. Return credentials
            return ResponseEntity.ok(Map.of(
                    "streamKey", streamKey,
                    "muxStreamId", muxStreamId,
                    "muxPlaybackId", muxPlaybackId,
                    "streamId", savedStream.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create MUX stream: " + e.getMessage());
        }
    }

    @PostMapping("/mux/webhook")
    public ResponseEntity<String> muxWebhook(@RequestBody Map<String, Object> payload) {
        // MUX will send events like video.live_stream.connected,
        // video.live_stream.disconnected, etc.
        try {
            Map data = (Map) payload.get("data");
            String muxStreamId = (String) data.get("id");
            String eventType = (String) payload.get("type");
            com.GoLive.GoLiveBackend.entities.Stream stream = streamService.findStreamByMuxStreamId(muxStreamId);
            if (stream != null) {
                switch (eventType) {
                    case "video.live_stream.connected":
                        stream.setMuxStatus("active");
                        stream.setLive(true);
                        // Send WebSocket notification that stream started
                        webSocketController.notifyStreamStarted(stream);
                        break;
                    case "video.live_stream.disconnected":
                        stream.setMuxStatus("idle");
                        stream.setLive(false);
                        // Send WebSocket notification that stream ended
                        webSocketController.notifyStreamEnded(stream);
                        break;
                    case "video.live_stream.recording":
                        stream.setMuxStatus("recording");
                        break;
                    case "video.live_stream.idle":
                        stream.setMuxStatus("idle");
                        stream.setLive(false);
                        // Send WebSocket notification that stream ended
                        webSocketController.notifyStreamEnded(stream);
                        break;
                    case "video.live_stream.completed":
                        stream.setMuxStatus("completed");
                        stream.setLive(false);
                        // Send WebSocket notification that stream ended
                        webSocketController.notifyStreamEnded(stream);
                        break;
                }
                streamService.saveStream(stream);
            }
            return ResponseEntity.ok("ok");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Webhook error: " + e.getMessage());
        }
    }
}