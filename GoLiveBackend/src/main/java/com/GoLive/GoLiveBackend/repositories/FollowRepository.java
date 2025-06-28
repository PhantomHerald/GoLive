package com.GoLive.GoLiveBackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.GoLive.GoLiveBackend.entities.Follow;
import com.GoLive.GoLiveBackend.entities.User;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    @Query("SELECT f FROM Follow f WHERE f.follower.id = :followerId AND f.followed.id = :followedId")
    Optional<Follow> findByFollowerAndFollowed(@Param("followerId") Long followerId,
            @Param("followedId") Long followedId);

    @Query("SELECT f.followed FROM Follow f WHERE f.follower.id = :followerId")
    List<User> findFollowedByFollowerId(@Param("followerId") Long followerId);

    @Query("SELECT f.follower FROM Follow f WHERE f.followed.id = :followedId")
    List<User> findFollowersByFollowedId(@Param("followedId") Long followedId);

    @Query("SELECT COUNT(f) FROM Follow f WHERE f.followed.id = :userId")
    Long countFollowedByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(f) FROM Follow f WHERE f.follower.id = :userId")
    Long countFollowingByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(f) FROM Follow f WHERE f.followed.id = :userId")
    Long countFollowersByUserId(@Param("userId") Long userId);
}