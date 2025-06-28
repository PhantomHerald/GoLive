package com.GoLive.GoLiveBackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.GoLive.GoLiveBackend.entities.StreamRecording;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StreamRecordingRepository extends JpaRepository<StreamRecording, Long> {
    
    List<StreamRecording> findByStreamIdOrderByCreatedAtDesc(Long streamId);
} 