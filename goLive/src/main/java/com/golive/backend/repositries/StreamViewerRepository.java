package com.golive.backend.repositries;

import com.golive.backend.entities.StreamViewer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StreamViewerRepository extends JpaRepository<StreamViewer, Integer> {
    Optional<StreamViewer> findByStreamId(int streamId);
}
