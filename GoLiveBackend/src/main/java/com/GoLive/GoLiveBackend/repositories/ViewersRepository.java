package com.GoLive.GoLiveBackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.GoLive.GoLiveBackend.entities.Viewers;
import org.springframework.stereotype.Repository;
 
@Repository
public interface ViewersRepository extends JpaRepository<Viewers, Integer> {
    @Query("SELECT COUNT(v) FROM Viewers v WHERE v.stream.id = :streamId")
    Long countByStreamId(@Param("streamId") Long streamId);
} 