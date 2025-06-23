package com.GoLive.GoLiveBackend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StreamCategoriesRepository extends JpaRepository<StreamCategories, StreamCategoriesId> {
    List<StreamCategories> findByStreamId(Long streamId);
    List<StreamCategories> findByCategoryId(Integer categoryId);
} 