package com.GoLive.GoLiveBackend.controllers;

import com.GoLive.GoLiveBackend.dtos.JoinEventRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stream-events")
@CrossOrigin(origins = "*") // For demo; restrict in production!
public class StreamEventController {

    @PostMapping("/on-join")
    public ResponseEntity<?> onJoin(@RequestBody JoinEventRequest request) {
        // Log or save the join event
        System.out.println("User " + request.getUserId() + " joined stream " + request.getStreamId() + " at " + request.getJoinedAt());
        return ResponseEntity.ok().body("Join event received");
    }
} 