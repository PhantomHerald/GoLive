package com.golive.backend.dtos.video;

import lombok.Data;

@Data
public class VideoResponse {
    private Long id;
    private String title;
    private String channelName;
    private String thumbnailUrl;
    private int viewCount;
    private String uploadedAt;
}
