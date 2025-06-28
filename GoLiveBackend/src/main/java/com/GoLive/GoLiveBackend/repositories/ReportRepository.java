package com.GoLive.GoLiveBackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.GoLive.GoLiveBackend.entities.Report;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    List<Report> findByStatus(Report.ReportStatus status);
    
    List<Report> findByStreamId(Long streamId);
    
    List<Report> findByReporterId(Long reporterId);
} 