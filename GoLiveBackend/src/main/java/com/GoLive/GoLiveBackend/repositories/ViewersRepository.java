package com.GoLive.GoLiveBackend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface ViewersRepository extends JpaRepository<Viewers, Integer> {
    // Add custom query methods if needed
} 