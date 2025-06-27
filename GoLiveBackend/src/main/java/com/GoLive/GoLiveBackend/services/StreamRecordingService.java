package com.GoLive.GoLiveBackend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StreamRecordingService {

    private static final Logger logger = LoggerFactory.getLogger(StreamRecordingService.class);

    @Autowired
    private StreamRecordingRepository recordingRepository;

    @Autowired
    private StreamRepository streamRepository;

    @Autowired
    private UserService userService;

    public StreamRecording addRecording(Long streamId, StreamRecordingRequest request, String token) throws Exception {
        logger.info("Adding recording for stream: {}", streamId);

        User user = userService.validateToken(token);
        Stream stream = streamRepository.findById(streamId)
                .orElseThrow(() -> new RuntimeException("Stream not found"));

        // Check if user owns the stream
        if (!stream.getStreamer().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You can only add recordings to your own streams");
        }

        // Validate recording URL
        if (request.getRecordingUrl() == null || request.getRecordingUrl().trim().isEmpty()) {
            throw new RuntimeException("Recording URL cannot be empty");
        }

        StreamRecording recording = new StreamRecording();
        recording.setRecordingUrl(request.getRecordingUrl().trim());
        recording.setTitle(request.getTitle());
        recording.setDurationSeconds(request.getDurationSeconds());
        recording.setFileSizeBytes(request.getFileSizeBytes());
        recording.setStream(stream);

        StreamRecording savedRecording = recordingRepository.save(recording);
        logger.info("Recording added successfully: {}", savedRecording.getId());

        return savedRecording;
    }

    public List<StreamRecording> getRecordingsByStream(Long streamId) {
        logger.info("Getting recordings for stream: {}", streamId);
        List<StreamRecording> recordings = recordingRepository.findByStreamIdOrderByCreatedAtDesc(streamId);
        logger.info("Found {} recordings for stream {}", recordings.size(), streamId);
        return recordings;
    }

    public void deleteRecording(Long recordingId, String token) throws Exception {
        logger.info("Deleting recording: {}", recordingId);

        User user = userService.validateToken(token);
        StreamRecording recording = recordingRepository.findById(recordingId)
                .orElseThrow(() -> new RuntimeException("Recording not found"));

        // Check if user owns the stream
        if (!recording.getStream().getStreamer().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You can only delete recordings from your own streams");
        }

        recordingRepository.delete(recording);
        logger.info("Recording deleted successfully: {}", recordingId);
    }
}