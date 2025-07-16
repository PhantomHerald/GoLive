package com.golive.backend.dtos.report;

import lombok.Data;

@Data
public class ReportRequest {
    private Long reportedItemId;
    private Long reporterId;
    private String reason;
    private String type; // e.g., "user", "stream", "video"
}
