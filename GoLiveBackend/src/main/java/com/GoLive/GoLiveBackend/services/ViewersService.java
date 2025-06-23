package com.GoLive.GoLiveBackend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ViewersService {
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
} 