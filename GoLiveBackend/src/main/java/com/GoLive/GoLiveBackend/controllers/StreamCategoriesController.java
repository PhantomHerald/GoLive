package com.GoLive.GoLiveBackend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stream-categories")
public class StreamCategoriesController {
    @Autowired
    private StreamCategoriesService streamCategoriesService;

    @GetMapping
    public List<StreamCategories> getAllStreamCategories() {
        return streamCategoriesService.getAllStreamCategories();
    }

    @GetMapping("/stream/{streamId}")
    public List<StreamCategories> getCategoriesByStreamId(@PathVariable Long streamId) {
        return streamCategoriesService.getCategoriesByStreamId(streamId);
    }

    @GetMapping("/category/{categoryId}")
    public List<StreamCategories> getStreamsByCategoryId(@PathVariable Integer categoryId) {
        return streamCategoriesService.getStreamsByCategoryId(categoryId);
    }

    @PostMapping
    public StreamCategories createStreamCategory(@RequestBody StreamCategories streamCategories) {
        return streamCategoriesService.saveStreamCategory(streamCategories);
    }

    @DeleteMapping("/{streamId}/{categoryId}")
    public ResponseEntity<Void> deleteStreamCategory(@PathVariable Long streamId, @PathVariable Integer categoryId) {
        streamCategoriesService.deleteStreamCategory(streamId, categoryId);
        return ResponseEntity.noContent().build();
    }
} 