package com.GoLive.GoLiveBackend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StreamCategoriesService {
    @Autowired
    private StreamCategoriesRepository streamCategoriesRepository;

    public List<StreamCategories> getAllStreamCategories() {
        return streamCategoriesRepository.findAll();
    }

    public List<StreamCategories> getCategoriesByStreamId(Long streamId) {
        return streamCategoriesRepository.findByStreamId(streamId);
    }

    public List<StreamCategories> getStreamsByCategoryId(Integer categoryId) {
        return streamCategoriesRepository.findByCategoryId(categoryId);
    }

    public StreamCategories saveStreamCategory(StreamCategories streamCategories) {
        return streamCategoriesRepository.save(streamCategories);
    }

    public void deleteStreamCategory(Long streamId, Integer categoryId) {
        StreamCategoriesId id = new StreamCategoriesId(streamId, categoryId);
        streamCategoriesRepository.deleteById(id);
    }
} 