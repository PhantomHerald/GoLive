package com.GoLive.GoLiveBackend.controllers;

import com.GoLive.GoLiveBackend.dtos.StreamRecordingRequest;
import com.GoLive.GoLiveBackend.entities.StreamRecording;
import com.GoLive.GoLiveBackend.services.StreamRecordingService;
import com.GoLive.GoLiveBackend.services.StreamService;
import com.GoLive.GoLiveBackend.services.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class UploadController {

    @Autowired
    private StreamRecordingService recordingService;

    @Autowired
    private StreamService streamService;

    @Autowired
    private S3Service s3Service;

    @PostMapping("/video")
    public ResponseEntity<?> uploadVideo(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "category", required = false) String category,
            @RequestHeader("Authorization") String token) {
        try {
            // Upload file to S3
            InputStream inputStream = file.getInputStream();
            String s3Key = s3Service.uploadVideo(inputStream, file.getOriginalFilename(), file.getContentType());

            // Generate presigned URL for the uploaded video
            String presignedUrl = s3Service.generatePresignedUrl(s3Key);

            // Create stream recording request
            StreamRecordingRequest request = new StreamRecordingRequest();
            request.setRecordingUrl(presignedUrl);
            request.setTitle(title);
            request.setDurationSeconds(0L); // Would be calculated from video metadata
            request.setFileSizeBytes((long) file.getSize());

            // Create a stream for this upload
            com.GoLive.GoLiveBackend.dtos.StreamRequest streamRequest = new com.GoLive.GoLiveBackend.dtos.StreamRequest();
            streamRequest.setTitle(title);
            streamRequest.setDescription(description);
            streamRequest.setCategory(category != null ? category : "General");

            com.GoLive.GoLiveBackend.entities.Stream stream = streamService.createStream(streamRequest, token);

            // Add recording to the stream
            StreamRecording recording = recordingService.addRecording(stream.getId(), request, token);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Video uploaded successfully to S3",
                    "recordingId", recording.getId(),
                    "streamId", stream.getId(),
                    "recordingUrl", presignedUrl,
                    "s3Key", s3Key));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to upload video: " + e.getMessage()));
        }
    }

    @GetMapping("/recordings/{streamId}")
    public ResponseEntity<List<StreamRecording>> getRecordingsByStream(@PathVariable Long streamId) {
        try {
            List<StreamRecording> recordings = recordingService.getRecordingsByStream(streamId);
            return ResponseEntity.ok(recordings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/videos")
    public ResponseEntity<?> getAllVideos() {
        try {
            List<S3Service.VideoInfo> videos = s3Service.listVideos();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "videos", videos
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to fetch videos: " + e.getMessage()
            ));
        }
    }
}