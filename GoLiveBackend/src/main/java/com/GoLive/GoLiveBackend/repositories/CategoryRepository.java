package com.GoLive.GoLiveBackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.GoLive.GoLiveBackend.entities.Category;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findByName(String name);
}