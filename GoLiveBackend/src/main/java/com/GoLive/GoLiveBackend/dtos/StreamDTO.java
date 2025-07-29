package com.GoLive.GoLiveBackend.dtos;

import com.GoLive.GoLiveBackend.entities.Stream;
import com.GoLive.GoLiveBackend.entities.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.sql.Timestamp;

public class StreamDTO {
    private Long id;
    private String title;
    private String description;
    private String streamKey;
    private boolean isLive;
    private Timestamp startedAt;
    private Timestamp endedAt;
    private String thumbnailUrl;
    private String category;
    private String muxStreamId;
    private String muxPlaybackId;
    private String muxStatus;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private Long viewerCount;
    private Long followerCount;
    
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User streamer;

    public StreamDTO() {}

    public StreamDTO(Stream stream, Long viewerCount, Long followerCount) {
        this.id = stream.getId();
        this.title = stream.getTitle();
        this.description = stream.getDescription();
        this.streamKey = stream.getStreamKey();
        this.isLive = stream.isLive();
        this.startedAt = stream.getStartedAt();
        this.endedAt = stream.getEndedAt();
        this.thumbnailUrl = stream.getThumbnailUrl();
        this.category = stream.getCategory();
        this.muxStreamId = stream.getMuxStreamId();
        this.muxPlaybackId = stream.getMuxPlaybackId();
        this.muxStatus = stream.getMuxStatus();
        this.createdAt = stream.getCreatedAt();
        this.updatedAt = stream.getUpdatedAt();
        this.streamer = stream.getStreamer();
        this.viewerCount = viewerCount;
        this.followerCount = followerCount;
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

    public String getMuxStreamId() {
        return muxStreamId;
    }

    public void setMuxStreamId(String muxStreamId) {
        this.muxStreamId = muxStreamId;
    }

    public String getMuxPlaybackId() {
        return muxPlaybackId;
    }

    public void setMuxPlaybackId(String muxPlaybackId) {
        this.muxPlaybackId = muxPlaybackId;
    }

    public String getMuxStatus() {
        return muxStatus;
    }

    public void setMuxStatus(String muxStatus) {
        this.muxStatus = muxStatus;
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

    public User getStreamer() {
        return streamer;
    }

    public void setStreamer(User streamer) {
        this.streamer = streamer;
    }

    public Long getViewerCount() {
        return viewerCount;
    }

    public void setViewerCount(Long viewerCount) {
        this.viewerCount = viewerCount;
    }

    public Long getFollowerCount() {
        return followerCount;
    }

    public void setFollowerCount(Long followerCount) {
        this.followerCount = followerCount;
    }
} 