package com.GoLive.GoLiveBackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.GoLive.GoLiveBackend.entities.Stream;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StreamRepository extends JpaRepository<Stream, Long> {

    List<Stream> findByIsLiveTrue();

    List<Stream> findByStreamerId(Long streamerId);

    List<Stream> findByCategory(String category);

    Optional<Stream> findByStreamKey(String streamKey);

    @Query("SELECT s FROM Stream s WHERE s.streamer.id = :streamerId AND s.isLive = true")
    Optional<Stream> findLiveStreamByStreamerId(@Param("streamerId") Long streamerId);

    @Query("SELECT s FROM Stream s WHERE s.title LIKE %:searchTerm% OR s.description LIKE %:searchTerm%")
    List<Stream> searchStreams(@Param("searchTerm") String searchTerm);
}