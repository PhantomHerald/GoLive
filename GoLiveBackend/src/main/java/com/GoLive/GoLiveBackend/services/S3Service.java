package com.GoLive.GoLiveBackend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.InputStream;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class S3Service {

    private static final Logger logger = LoggerFactory.getLogger(S3Service.class);

    @Autowired
    private S3Client s3Client;

    @Autowired
    private S3Presigner s3Presigner;

    @Autowired
    private String bucketName;

    public String uploadVideo(InputStream inputStream, String originalFilename, String contentType) {
        try {
            // Generate unique key for the video
            String fileExtension = getFileExtension(originalFilename);
            String videoKey = "videos/" + UUID.randomUUID().toString() + fileExtension;

            // Upload to S3
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(videoKey)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, inputStream.available()));

            logger.info("Video uploaded successfully to S3: {}", videoKey);
            return videoKey;
        } catch (Exception e) {
            logger.error("Error uploading video to S3", e);
            throw new RuntimeException("Failed to upload video to S3", e);
        }
    }

    public List<VideoInfo> listVideos() {
        try {
            ListObjectsV2Request request = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .prefix("videos/")
                    .build();

            ListObjectsV2Response response = s3Client.listObjectsV2(request);
            List<VideoInfo> videos = new ArrayList<>();

            for (S3Object s3Object : response.contents()) {
                String key = s3Object.key();
                if (isVideoFile(key)) {
                    String presignedUrl = generatePresignedUrl(key);
                    videos.add(new VideoInfo(key, presignedUrl, s3Object.size(), s3Object.lastModified()));
                }
            }

            logger.info("Found {} videos in S3 bucket", videos.size());
            return videos;
        } catch (Exception e) {
            logger.error("Error listing videos from S3", e);
            throw new RuntimeException("Failed to list videos from S3", e);
        }
    }

    public String generatePresignedUrl(String objectKey) {
        try {
            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofHours(1)) // URL valid for 1 hour
                    .getObjectRequest(GetObjectRequest.builder()
                            .bucket(bucketName)
                            .key(objectKey)
                            .build())
                    .build();

            PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
            return presignedRequest.url().toString();
        } catch (Exception e) {
            logger.error("Error generating presigned URL for key: {}", objectKey, e);
            throw new RuntimeException("Failed to generate presigned URL", e);
        }
    }

    public void deleteVideo(String objectKey) {
        try {
            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .build();

            s3Client.deleteObject(deleteRequest);
            logger.info("Video deleted successfully from S3: {}", objectKey);
        } catch (Exception e) {
            logger.error("Error deleting video from S3: {}", objectKey, e);
            throw new RuntimeException("Failed to delete video from S3", e);
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return ".mp4";
        }
        int lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex > 0 ? filename.substring(lastDotIndex) : ".mp4";
    }

    private boolean isVideoFile(String key) {
        String lowerKey = key.toLowerCase();
        return lowerKey.endsWith(".mp4") ||
                lowerKey.endsWith(".mov") ||
                lowerKey.endsWith(".avi") ||
                lowerKey.endsWith(".mkv") ||
                lowerKey.endsWith(".webm");
    }

    public static class VideoInfo {
        private String key;
        private String presignedUrl;
        private Long size;
        private java.time.Instant lastModified;

        public VideoInfo(String key, String presignedUrl, Long size, java.time.Instant lastModified) {
            this.key = key;
            this.presignedUrl = presignedUrl;
            this.size = size;
            this.lastModified = lastModified;
        }

        // Getters
        public String getKey() {
            return key;
        }

        public String getPresignedUrl() {
            return presignedUrl;
        }

        public Long getSize() {
            return size;
        }

        public java.time.Instant getLastModified() {
            return lastModified;
        }

        // Setters
        public void setKey(String key) {
            this.key = key;
        }

        public void setPresignedUrl(String presignedUrl) {
            this.presignedUrl = presignedUrl;
        }

        public void setSize(Long size) {
            this.size = size;
        }

        public void setLastModified(java.time.Instant lastModified) {
            this.lastModified = lastModified;
        }
    }
}