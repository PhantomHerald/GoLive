package com.GoLive.GoLiveBackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.GoLive.GoLiveBackend.entities.Viewers;
import org.springframework.stereotype.Repository;
 
@Repository
public interface ViewersRepository extends JpaRepository<Viewers, Integer> {
    // Add custom query methods if needed
} 