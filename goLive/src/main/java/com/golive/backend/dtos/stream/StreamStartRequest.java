package com.golive.backend.dtos.stream;

import lombok.Data;

@Data
public class StreamStartRequest {
    private String title;
    private Integer categoryId;
    private String thumbnailUrl;
    private boolean isPublic;
}
