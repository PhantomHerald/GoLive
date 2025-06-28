package com.GoLive.GoLiveBackend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.GoLive.GoLiveBackend.entities.Stream;
import com.GoLive.GoLiveBackend.repositories.StreamRepository;
import com.GoLive.GoLiveBackend.dtos.StreamRequest;
import com.GoLive.GoLiveBackend.entities.User;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class StreamService {

    private static final Logger logger = LoggerFactory.getLogger(StreamService.class);

    @Autowired
    private StreamRepository streamRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    public Stream createStream(StreamRequest request, String token) throws Exception {
        logger.info("Creating stream for user with token");

        User streamer = userService.validateToken(token);

        // Check if user is already streaming
        Optional<Stream> existingLiveStream = streamRepository.findLiveStreamByStreamerId(streamer.getId());
        if (existingLiveStream.isPresent()) {
            throw new RuntimeException("User is already streaming");
        }

        Stream stream = new Stream();
        stream.setTitle(request.getTitle());
        stream.setDescription(request.getDescription());
        stream.setCategory(request.getCategory());
        stream.setThumbnailUrl(request.getThumbnailUrl());
        stream.setStreamer(streamer);

        Stream savedStream = streamRepository.save(stream);
        logger.info("Stream created successfully: {}", savedStream.getId());

        return savedStream;
    }

    public Stream goLive(Long streamId, String token) throws Exception {
        logger.info("Going live for stream: {}", streamId);

        User streamer = userService.validateToken(token);
        Stream stream = streamRepository.findById(streamId)
                .orElseThrow(() -> new RuntimeException("Stream not found"));

        // Check if user owns the stream
        if (!stream.getStreamer().getId().equals(streamer.getId())) {
            throw new RuntimeException("Unauthorized: You can only go live on your own streams");
        }

        // Check if already live
        if (stream.isLive()) {
            throw new RuntimeException("Stream is already live");
        }

        stream.setLive(true);
        stream.setStartedAt(new Timestamp(System.currentTimeMillis()));
        stream.setEndedAt(null);

        Stream updatedStream = streamRepository.save(stream);
        logger.info("Stream went live successfully: {}", updatedStream.getId());
        
        // Notify followers that streamer went live
        try {
            notificationService.notifyStreamLive(streamer.getId(), stream.getTitle(), stream.getId());
        } catch (Exception e) {
            logger.error("Error notifying followers about stream going live", e);
        }
        
        return updatedStream;
    }

    public Stream endStream(Long streamId, String token) throws Exception {
        logger.info("Ending stream: {}", streamId);

        User streamer = userService.validateToken(token);
        Stream stream = streamRepository.findById(streamId)
                .orElseThrow(() -> new RuntimeException("Stream not found"));

        // Check if user owns the stream
        if (!stream.getStreamer().getId().equals(streamer.getId())) {
            throw new RuntimeException("Unauthorized: You can only end your own streams");
        }

        // Check if not live
        if (!stream.isLive()) {
            throw new RuntimeException("Stream is not live");
        }

        stream.setLive(false);
        stream.setEndedAt(new Timestamp(System.currentTimeMillis()));

        Stream updatedStream = streamRepository.save(stream);
        logger.info("Stream ended successfully: {}", updatedStream.getId());

        return updatedStream;
    }

    public List<Stream> getLiveStreams() {
        logger.info("Fetching all live streams");
        List<Stream> liveStreams = streamRepository.findByIsLiveTrue();
        logger.info("Found {} live streams", liveStreams.size());
        return liveStreams;
    }

    public Stream getStreamById(Long streamId) throws Exception {
        logger.info("Fetching stream by ID: {}", streamId);
        Stream stream = streamRepository.findById(streamId)
                .orElseThrow(() -> new RuntimeException("Stream not found"));
        logger.info("Stream found: {}", stream.getId());
        return stream;
    }

    public Stream getStreamByKey(String streamKey) throws Exception {
        logger.info("Fetching stream by key: {}", streamKey);
        Stream stream = streamRepository.findByStreamKey(streamKey)
                .orElseThrow(() -> new RuntimeException("Stream not found"));
        logger.info("Stream found: {}", stream.getId());
        return stream;
    }

    public List<Stream> getStreamsByCategory(String category) {
        logger.info("Fetching streams by category: {}", category);
        List<Stream> streams = streamRepository.findByCategory(category);
        logger.info("Found {} streams in category: {}", streams.size(), category);
        return streams;
    }

    public List<Stream> getStreamsByStreamer(Long streamerId) {
        logger.info("Fetching streams by streamer: {}", streamerId);
        List<Stream> streams = streamRepository.findByStreamerId(streamerId);
        logger.info("Found {} streams for streamer: {}", streams.size(), streamerId);
        return streams;
    }

    public Stream updateStream(Long streamId, StreamRequest request, String token) throws Exception {
        logger.info("Updating stream: {}", streamId);

        User streamer = userService.validateToken(token);
        Stream stream = streamRepository.findById(streamId)
                .orElseThrow(() -> new RuntimeException("Stream not found"));

        // Check if user owns the stream
        if (!stream.getStreamer().getId().equals(streamer.getId())) {
            throw new RuntimeException("Unauthorized: You can only update your own streams");
        }

        // Check if stream is live (can't update while live)
        if (stream.isLive()) {
            throw new RuntimeException("Cannot update stream while it's live");
        }

        if (request.getTitle() != null) {
            stream.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            stream.setDescription(request.getDescription());
        }
        if (request.getCategory() != null) {
            stream.setCategory(request.getCategory());
        }
        if (request.getThumbnailUrl() != null) {
            stream.setThumbnailUrl(request.getThumbnailUrl());
        }

        Stream updatedStream = streamRepository.save(stream);
        logger.info("Stream updated successfully: {}", updatedStream.getId());

        return updatedStream;
    }

    public void deleteStream(Long streamId, String token) throws Exception {
        logger.info("Deleting stream: {}", streamId);

        User streamer = userService.validateToken(token);
        Stream stream = streamRepository.findById(streamId)
                .orElseThrow(() -> new RuntimeException("Stream not found"));

        // Check if user owns the stream
        if (!stream.getStreamer().getId().equals(streamer.getId())) {
            throw new RuntimeException("Unauthorized: You can only delete your own streams");
        }

        // Check if stream is live (can't delete while live)
        if (stream.isLive()) {
            throw new RuntimeException("Cannot delete stream while it's live");
        }

        streamRepository.delete(stream);
        logger.info("Stream deleted successfully: {}", streamId);
    }

    public List<Stream> searchStreams(String searchTerm) {
        logger.info("Searching streams with term: {}", searchTerm);
        List<Stream> streams = streamRepository.searchStreams(searchTerm);
        logger.info("Found {} streams matching search term", streams.size());
        return streams;
    }

    public String generateNewStreamKey(Long streamId, String token) throws Exception {
        logger.info("Generating new stream key for stream: {}", streamId);

        User streamer = userService.validateToken(token);
        Stream stream = streamRepository.findById(streamId)
                .orElseThrow(() -> new RuntimeException("Stream not found"));

        // Check if user owns the stream
        if (!stream.getStreamer().getId().equals(streamer.getId())) {
            throw new RuntimeException("Unauthorized: You can only regenerate keys for your own streams");
        }

        // Generate new stream key
        String newStreamKey = java.util.UUID.randomUUID().toString().replace("-", "");
        stream.setStreamKey(newStreamKey);

        streamRepository.save(stream);
        logger.info("New stream key generated for stream: {}", streamId);

        return newStreamKey;
    }
}