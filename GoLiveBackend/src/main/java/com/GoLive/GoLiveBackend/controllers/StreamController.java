package com.GoLive.GoLiveBackend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.GoLive.GoLiveBackend.services.StreamService;
import com.GoLive.GoLiveBackend.entities.Stream;
import com.GoLive.GoLiveBackend.dtos.StreamRequest;

import java.util.List;

@RestController
@RequestMapping("/api/streams")
public class StreamController {

    @Autowired
    private StreamService streamService;

    @GetMapping
    public List<Stream> getAllStreams() {
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
    public List<Stream> getLiveStreams() {
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
            return ResponseEntity.ok(stream);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/end-stream")
    public ResponseEntity<Stream> endStream(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            Stream stream = streamService.endStream(id, token);
            return ResponseEntity.ok(stream);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}