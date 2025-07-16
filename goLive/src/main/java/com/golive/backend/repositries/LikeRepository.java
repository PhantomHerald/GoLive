package com.golive.backend.repositries;

import com.golive.backend.entities.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    @Override
    Optional<Like> findById(Long aLong);
}
