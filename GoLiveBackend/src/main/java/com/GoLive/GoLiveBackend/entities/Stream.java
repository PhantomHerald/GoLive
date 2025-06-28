package com.GoLive.GoLiveBackend.entities;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "streams")
public class Stream {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "stream_key", nullable = false, unique = true)
    private String streamKey;

    @Column(name = "is_live", nullable = false)
    private boolean isLive = false;

    @Column(name = "started_at")
    private Timestamp startedAt;

    @Column(name = "ended_at")
    private Timestamp endedAt;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "category")
    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User streamer;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    @Column(name = "updated_at")
    private Timestamp updatedAt = new Timestamp(System.currentTimeMillis());

    // Constructor to generate stream key
    public Stream() {
        this.streamKey = generateStreamKey();
    }

    private String generateStreamKey() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStreamKey() {
        return streamKey;
    }

    public void setStreamKey(String streamKey) {
        this.streamKey = streamKey;
    }

    public boolean isLive() {
        return isLive;
    }

    public void setLive(boolean live) {
        isLive = live;
    }

    public Timestamp getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Timestamp startedAt) {
        this.startedAt = startedAt;
    }

    public Timestamp getEndedAt() {
        return endedAt;
    }

    public void setEndedAt(Timestamp endedAt) {
        this.endedAt = endedAt;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public User getStreamer() {
        return streamer;
    }

    public void setStreamer(User streamer) {
        this.streamer = streamer;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Timestamp(System.currentTimeMillis());
    }

    @Override
    public String toString() {
        return "Stream{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", streamKey='" + streamKey + '\'' +
                ", isLive=" + isLive +
                ", streamer=" + (streamer != null ? streamer.getUsername() : "null") +
                ", createdAt=" + createdAt +
                '}';
    }
}