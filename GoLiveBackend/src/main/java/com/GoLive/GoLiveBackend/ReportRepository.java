package com.GoLive.GoLiveBackend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    List<Report> findByStatus(Report.ReportStatus status);
    
    List<Report> findByStreamId(Long streamId);
    
    List<Report> findByReporterId(Long reporterId);
} 