package com.golive.backend.controllers.stream;

import com.golive.backend.dtos.stream.StreamDto;
import com.golive.backend.services.StreamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/streams")
@RestController
@RequiredArgsConstructor
public class StreamController {
    private final StreamService streamService;

    //  Start a new stream
    @PostMapping("/start")
    public ResponseEntity<StreamDto> startStream(@RequestBody StreamDto streamDto) {
        return ResponseEntity.ok(streamService.startStream(streamDto));
    }

    //  End a stream
    @PostMapping("/end/{id}")
    public ResponseEntity<StreamDto> endStream(@PathVariable Integer id) {
        return ResponseEntity.ok(streamService.endStream(id));
    }

    //  Get all live streams
    @GetMapping("/live")
    public ResponseEntity<List<StreamDto>> getAllLiveStreams() {
        return ResponseEntity.ok(streamService.getAllLiveStreams());
    }

    //  Get stream by ID
    @GetMapping("/{id}")
    public ResponseEntity<StreamDto> getStreamById(@PathVariable Integer id) {
        return ResponseEntity.ok(streamService.getStreamById(id));
    }

    //  Get all streams for a specific channel
    @GetMapping("/channel/{channelId}")
    public ResponseEntity<List<StreamDto>> getStreamsByChannelId(@PathVariable Integer channelId) {
        return ResponseEntity.ok(streamService.getStreamsByChannelId(channelId));
    }

    //  Update stream title
    @PutMapping("/{id}/title")
    public ResponseEntity<StreamDto> updateTitle(
            @PathVariable Integer id,
            @RequestParam String title) {
        return ResponseEntity.ok(streamService.updateStreamTitle(id, title));
    }
}

