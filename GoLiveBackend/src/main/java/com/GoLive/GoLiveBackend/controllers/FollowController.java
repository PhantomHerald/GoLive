package com.GoLive.GoLiveBackend.controllers;

import com.GoLive.GoLiveBackend.entities.User;
import com.GoLive.GoLiveBackend.services.FollowService;
import com.GoLive.GoLiveBackend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/follow")
@CrossOrigin(origins = "*")
public class FollowController {

    @Autowired
    private FollowService followService;

    @Autowired
    private UserService userService;

    @PostMapping("/{userId}")
    public ResponseEntity<?> followUser(@PathVariable Long userId, @RequestHeader("Authorization") String token) {
        try {
            followService.followUser(userId, token);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Successfully followed user"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> unfollowUser(@PathVariable Long userId, @RequestHeader("Authorization") String token) {
        try {
            followService.unfollowUser(userId, token);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Successfully unfollowed user"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @GetMapping("/following")
    public ResponseEntity<?> getFollowing(@RequestHeader("Authorization") String token) {
        try {
            System.out.println("Received token: " + token);
            List<User> following = followService.getFollowedUsers(token);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "following", following));
        } catch (Exception e) {
            System.out.println("Error in getFollowing: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @GetMapping("/followers/{userId}")
    public ResponseEntity<?> getFollowers(@PathVariable Long userId) {
        try {
            List<User> followers = followService.getFollowers(userId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "followers", followers));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @GetMapping("/following/{userId}")
    public ResponseEntity<?> getFollowingByUserId(@PathVariable Long userId) {
        try {
            List<User> following = followService.getFollowedUsersByUserId(userId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "following", following));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @GetMapping("/check/{userId}")
    public ResponseEntity<?> isFollowing(@PathVariable Long userId, @RequestHeader("Authorization") String token) {
        try {
            boolean isFollowing = followService.isFollowing(userId, token);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "isFollowing", isFollowing));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @GetMapping("/stats/{userId}")
    public ResponseEntity<?> getFollowStats(@PathVariable Long userId) {
        try {
            Long followersCount = followService.getFollowersCount(userId);
            Long followingCount = followService.getFollowingCount(userId);

            Map<String, Object> stats = new HashMap<>();
            stats.put("followersCount", followersCount);
            stats.put("followingCount", followingCount);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "stats", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @GetMapping("/test-auth")
    public ResponseEntity<?> testAuth(@RequestHeader("Authorization") String token) {
        try {
            System.out.println("Testing auth with token: " + token);
            User user = userService.validateToken(token);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Authentication successful",
                    "username", user.getUsername(),
                    "userId", user.getId()));
        } catch (Exception e) {
            System.out.println("Auth test failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }
}