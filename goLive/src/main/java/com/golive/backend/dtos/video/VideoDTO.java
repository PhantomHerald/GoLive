package com.golive.backend.dtos.video;

import lombok.Data;

@Data
public class VideoDTO {
    private Long id;
    private String title;
    private String description;
    private String videoUrl;
    private String thumbnailUrl;
    private boolean isPublic;
}
