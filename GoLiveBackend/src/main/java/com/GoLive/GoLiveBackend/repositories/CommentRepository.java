package com.GoLive.GoLiveBackend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.GoLive.GoLiveBackend.entities.Comment;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByStreamIdOrderByCreatedAtDesc(Long streamId);

    Page<Comment> findByStreamIdOrderByCreatedAtDesc(Long streamId, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.stream.id = :streamId ORDER BY c.createdAt DESC")
    List<Comment> findCommentsByStreamIdWithLimit(@Param("streamId") Long streamId, Pageable pageable);

    Long countByStreamId(Long streamId);
}