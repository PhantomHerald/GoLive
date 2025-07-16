package com.golive.backend.mappers;

import com.golive.backend.dtos.report.ReportResponse;
import com.golive.backend.entities.Report;
import org.mapstruct.Mapper;

@Mapper (componentModel = "spring")
public interface ReportMapper {
    ReportResponse toReportResponse(Report report);
}
