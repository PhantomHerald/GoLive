package com.GoLive.GoLiveBackend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    
    @Query("SELECT l FROM Like l WHERE l.user.id = :userId AND l.stream.id = :streamId")
    Optional<Like> findByUserIdAndStreamId(@Param("userId") Long userId, @Param("streamId") Long streamId);
    
    @Query("SELECT COUNT(l) FROM Like l WHERE l.stream.id = :streamId")
    Long countByStreamId(@Param("streamId") Long streamId);
    
    @Query("SELECT COUNT(l) FROM Like l WHERE l.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
} 