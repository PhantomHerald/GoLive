package com.golive.backend.dtos.stream;

import lombok.Data;

@Data
public class StreamEndRequest {
    private Long streamId;
    private int durationInSeconds;
    private String endedAt;
}
