package com.GoLive.GoLiveBackend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    
    @Query("SELECT f FROM Follow f WHERE f.follower.id = :followerId AND f.following.id = :followingId")
    Optional<Follow> findByFollowerAndFollowing(@Param("followerId") Long followerId, @Param("followingId") Long followingId);
    
    @Query("SELECT f.following FROM Follow f WHERE f.follower.id = :followerId")
    List<User> findFollowedUsersByFollowerId(@Param("followerId") Long followerId);
    
    @Query("SELECT f.follower FROM Follow f WHERE f.following.id = :followingId")
    List<User> findFollowersByFollowingId(@Param("followingId") Long followingId);
    
    @Query("SELECT COUNT(f) FROM Follow f WHERE f.following.id = :userId")
    Long countFollowersByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(f) FROM Follow f WHERE f.follower.id = :userId")
    Long countFollowingByUserId(@Param("userId") Long userId);
} 