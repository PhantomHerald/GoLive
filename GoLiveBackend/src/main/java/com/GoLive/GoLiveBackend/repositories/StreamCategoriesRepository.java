package com.GoLive.GoLiveBackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.GoLive.GoLiveBackend.entities.StreamCategories;
import com.GoLive.GoLiveBackend.entities.StreamCategoriesId;

@Repository
public interface StreamCategoriesRepository extends JpaRepository<StreamCategories, StreamCategoriesId> {
    List<StreamCategories> findByStreamId(Long streamId);

    List<StreamCategories> findByCategoryId(Integer categoryId);
}