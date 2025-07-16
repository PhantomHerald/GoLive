package com.golive.backend.dtos.stream;

import lombok.Data;

@Data
public class StreamStatus {
    private Long streamId;
    private boolean isLive;
    private int viewerCount;
    private int bitrate;
}
