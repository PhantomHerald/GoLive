package com.golive.backend.dtos.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportResponse {
    private Long id;
    private String reportedBy;
    private String type;
    private String reason;
    private String status; // e.g., "pending", "reviewed"
}
