package com.golive.backend.repositries;

import com.golive.backend.entities.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoRepository extends JpaRepository<Video, Integer> {
    // Find video by exact title
    Optional<Video> findVideoByTitle(String title);

    // Search videos that contain a keyword in the title (case-insensitive)
    List<Video> findByTitleContainingIgnoreCase(String keyword);

    // Find all videos by a specific channel ID
    List<Video> findByChannelId(Integer channelId);

    // Find all public videos (if you add the isPublic field later)
    List<Video> findByIsPublicTrue();

    // Fetch recent uploads (if using uploadedAt field)
    List<Video> findByUploadedAtAfter(java.time.Instant since);
}
