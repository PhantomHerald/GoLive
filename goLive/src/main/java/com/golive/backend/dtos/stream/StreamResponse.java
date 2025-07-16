package com.golive.backend.dtos.stream;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StreamResponse {
    private Long id;
    private String title;
    private String streamerUsername;
    private String streamUrl;
    private int viewerCount;
    private String categoryName;
    private String thumbnailUrl;
    private String startTime;
}
