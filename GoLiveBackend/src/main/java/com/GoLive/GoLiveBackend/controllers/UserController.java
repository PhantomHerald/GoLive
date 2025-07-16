package com.GoLive.GoLiveBackend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.GoLive.GoLiveBackend.services.UserService;
import com.GoLive.GoLiveBackend.entities.User;
import com.GoLive.GoLiveBackend.dtos.UpdateProfileRequest;
import com.GoLive.GoLiveBackend.security.JwtUtil;
import com.GoLive.GoLiveBackend.dtos.ChangeEmailRequest;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        try {
            User user = userService.validateToken(token);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateProfileRequest request) {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        try {
            User user = userService.validateToken(token);
            if (request.getDisplayName() != null)
                user.setDisplayName(request.getDisplayName());
            if (request.getUsername() != null)
                user.setUsername(request.getUsername());
            if (request.getBio() != null)
                user.setBio(request.getBio());
            User updated = userService.updateUser(user);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }

    @PostMapping("/change-email")
    public ResponseEntity<?> changeEmail(@RequestHeader("Authorization") String authHeader,
            @RequestBody ChangeEmailRequest request) {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        try {
            boolean success = userService.changeEmail(token, request.getNewEmail(), request.getPassword());
            if (!success) {
                return ResponseEntity.status(401).body("Incorrect password or email already in use");
            }
            // Optionally: send verification email here
            return ResponseEntity.ok("Verification email sent");
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}