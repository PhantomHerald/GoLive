package com.golive.backend.controllers.user;

import com.golive.backend.dtos.user.UserDto;
import com.golive.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 1. Register or login user using Firebase token
    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@RequestHeader("Authorization") String firebaseToken) {
        return ResponseEntity.ok(userService.registerUser(firebaseToken));
    }

    // 2. Get current authenticated user info
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@RequestHeader("Authorization") String firebaseToken) {
        return ResponseEntity.ok(userService.getUserByToken(firebaseToken));
    }

    // 3. Update profile of current user
    @PutMapping("/me")
    public ResponseEntity<UserDto> updateCurrentUser(@RequestHeader("Authorization") String firebaseToken,
                                                     @RequestBody UserDto updatedUser) {
        return ResponseEntity.ok(userService.updateCurrentUser(firebaseToken, updatedUser));
    }

    // 4. Get user by username
    @GetMapping("/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }
    }
