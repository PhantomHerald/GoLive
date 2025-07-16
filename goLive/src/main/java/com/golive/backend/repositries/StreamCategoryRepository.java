package com.golive.backend.repositries;

import com.golive.backend.entities.StreamCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StreamCategoryRepository extends JpaRepository<StreamCategory, Integer> {
    Optional<StreamCategory> findByCategory_Name(String name);

}
