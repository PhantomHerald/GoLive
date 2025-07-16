package com.golive.backend.repositries;

import com.golive.backend.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    Optional<Comment> findById(int id);
    List<Comment> findByVideoId(Integer videoId);
}
