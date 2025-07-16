package com.golive.backend.dtos.video;

import lombok.Data;

@Data
public class VideoUploadRequest {
    private String title;
    private String description;
    private String videoUrl;
    private String thumbnailUrl;
    private Long channelId;
}
