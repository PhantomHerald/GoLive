package com.GoLive.GoLiveBackend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/viewers")
public class ViewersController {
    @Autowired
    private ViewersService viewersService;

    @GetMapping
    public List<Viewers> getAllViewers() {
        return viewersService.getAllViewers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Viewers> getViewerById(@PathVariable Integer id) {
        Optional<Viewers> viewer = viewersService.getViewerById(id);
        return viewer.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Viewers createViewer(@RequestBody Viewers viewer) {
        return viewersService.saveViewer(viewer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteViewer(@PathVariable Integer id) {
        viewersService.deleteViewer(id);
        return ResponseEntity.noContent().build();
    }
} 