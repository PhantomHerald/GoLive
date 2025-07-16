package com.golive.backend.controllers.video;

import com.golive.backend.dtos.video.VideoDTO;
import com.golive.backend.services.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {
    private final VideoService videoService;

    // 1. Upload a new video
    @PostMapping
    public ResponseEntity<VideoDTO> uploadVideo(@RequestBody VideoDTO videoDto) {
        return ResponseEntity.ok(videoService.uploadVideo(videoDto));
    }

    // 2. Get all videos
    @GetMapping
    public ResponseEntity<List<VideoDTO>> getAllVideos() {
        return ResponseEntity.ok(videoService.getAllVideos());
    }

    // 3. Get a video by ID
    @GetMapping("/{id}")
    public ResponseEntity<VideoDTO> getVideoById(@PathVariable Integer id) {
        return ResponseEntity.ok(videoService.getVideoById(id));
    }

    // 4. Update a video
//    @PutMapping("/{id}")
//    public ResponseEntity<VideoDTO> updateVideo(@PathVariable Integer id, @RequestBody VideoDTO videoDto) {
//        return ResponseEntity.ok(videoService.updateVideo(id, videoDto));
//    }

    // 5. Delete a video
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Integer id) {
        videoService.deleteVideo(id);
        return ResponseEntity.noContent().build();
    }
}
