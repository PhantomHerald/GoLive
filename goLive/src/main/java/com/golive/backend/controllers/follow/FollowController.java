package com.golive.backend.controllers.follow;

import com.golive.backend.dtos.follow.FollowDTO;
import com.golive.backend.services.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {
    private final FollowService followService;

    // Follow a user
    @PostMapping
    public ResponseEntity<FollowDTO> followUser(@RequestBody FollowDTO followDTO) {
        return ResponseEntity.ok(followService.createFollow(followDTO));
    }

    // Unfollow a user
    @DeleteMapping
    public ResponseEntity<Void> unfollowUser(@RequestParam Integer followerId, @RequestParam Integer followingId) {
        followService.deleteFollow(followerId, followingId);
        return ResponseEntity.noContent().build();
    }

    // Get followers of a user
    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<FollowDTO>> getFollowers(@PathVariable Integer userId) {
        return ResponseEntity.ok(followService.getFollowers(userId));
    }

    // Get users that a user is following
    @GetMapping("/following/{userId}")
    public ResponseEntity<List<FollowDTO>> getFollowing(@PathVariable Integer userId) {
        return ResponseEntity.ok(followService.getFollowing(userId));
    }

}

