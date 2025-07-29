package com.GoLive.GoLiveBackend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.GoLive.GoLiveBackend.entities.Viewers;
import com.GoLive.GoLiveBackend.repositories.ViewersRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ViewersService {
    private static final Logger logger = LoggerFactory.getLogger(ViewersService.class);
    
    @Autowired
    private ViewersRepository viewersRepository;

    public List<Viewers> getAllViewers() {
        return viewersRepository.findAll();
    }

    public Optional<Viewers> getViewerById(Integer id) {
        return viewersRepository.findById(id);
    }

    public Viewers saveViewer(Viewers viewer) {
        return viewersRepository.save(viewer);
    }

    public void deleteViewer(Integer id) {
        viewersRepository.deleteById(id);
    }

    public Long getViewerCount(Long streamId) {
        logger.info("Getting viewer count for stream: {}", streamId);
        Long count = viewersRepository.countByStreamId(streamId);
        logger.info("Stream {} has {} viewers", streamId, count);
        return count;
    }
} 