package com.GoLive.GoLiveBackend.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.GoLive.GoLiveBackend.security.JwtUtil;
import com.GoLive.GoLiveBackend.services.UserService;
import com.GoLive.GoLiveBackend.entities.User;
import com.GoLive.GoLiveBackend.dtos.AuthRequest;
import com.GoLive.GoLiveBackend.dtos.AuthResponse;
import com.GoLive.GoLiveBackend.dtos.BioUpdateRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody AuthRequest request) {
        logger.info("Signup request received for user: {}", request.getUsername());
        try {
            User user = userService.registerUser(request);
            String token = jwtUtil.generateToken(user.getUsername(), user.getEmail(), user.getRoles());

            // Save the token to the database
            user.setRefreshToken(token);
            userService.updateUser(user);

            logger.info("User registered successfully: {}", user.getUsername());
            return ResponseEntity.ok(new AuthResponse("User registered successfully", token));
        } catch (Exception e) {
            logger.error("Registration failed for user: {}", request.getUsername(), e);
            return ResponseEntity.badRequest().body(new AuthResponse("Registration failed: " + e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        logger.info("Login request received for identifier: {}",
                request.getEmail() != null ? request.getEmail() : request.getUsername());
        try {
            // Use email if provided, otherwise use username
            String identifier = request.getEmail() != null && !request.getEmail().trim().isEmpty()
                    ? request.getEmail()
                    : request.getUsername();

            User user = userService.authenticateUserByEmailOrUsername(identifier, request.getPassword());
            String token = jwtUtil.generateToken(user.getUsername(), user.getEmail(), user.getRoles());

            // Save the token to the database
            user.setRefreshToken(token);
            userService.updateUser(user);

            logger.info("Login successful for user: {}", user.getUsername());
            return ResponseEntity.ok(new AuthResponse("Login successful", token));
        } catch (Exception e) {
            logger.error("Login failed for identifier: {}",
                    request.getEmail() != null ? request.getEmail() : request.getUsername(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Login failed: " + e.getMessage(), null));
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<AuthResponse> validateToken(@RequestHeader("Authorization") String authHeader) {
        logger.info("Token validation request received");
        try {
            // Remove "Bearer " prefix if present
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

            User user = userService.validateToken(token);
            logger.info("Token validated successfully for user: {}", user.getUsername());
            return ResponseEntity.ok(new AuthResponse("Token is valid", token));
        } catch (Exception e) {
            logger.error("Token validation failed", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Token validation failed: " + e.getMessage(), null));
        }
    }

    @PostMapping("/login/username")
    public ResponseEntity<AuthResponse> loginWithUsername(@RequestBody AuthRequest request) {
        logger.info("Username login request received for username: {}", request.getUsername());
        try {
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new AuthResponse("Username is required", null));
            }

            User user = userService.authenticateUserByEmailOrUsername(request.getUsername(), request.getPassword());
            String token = jwtUtil.generateToken(user.getUsername(), user.getEmail(), user.getRoles());

            // Save the token to the database
            user.setRefreshToken(token);
            userService.updateUser(user);

            logger.info("Username login successful for user: {}", user.getUsername());
            return ResponseEntity.ok(new AuthResponse("Login successful", token));
        } catch (Exception e) {
            logger.error("Username login failed for username: {}", request.getUsername(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Login failed: " + e.getMessage(), null));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        logger.info("Test endpoint accessed");
        return ResponseEntity.ok("Auth endpoints are working!");
    }

    @PutMapping("/update-bio")
    public ResponseEntity<AuthResponse> updateBio(@RequestHeader("Authorization") String authHeader,
            @RequestBody BioUpdateRequest request) {
        logger.info("Bio update request received");
        try {
            // Remove "Bearer " prefix if present
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

            User updatedUser = userService.updateUserBio(token, request.getBio());
            logger.info("Bio updated successfully for user: {}", updatedUser.getUsername());

            return ResponseEntity.ok(new AuthResponse("Bio updated successfully", token));
        } catch (Exception e) {
            logger.error("Bio update failed", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Bio update failed: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<AuthResponse> deleteAccount(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        logger.info("Delete account request received");
        try {
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            User user = userService.validateToken(token);
            String password = body.get("password");
            if (password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().body(new AuthResponse("Password is required", null));
            }
            if (!userService.checkPassword(user, password)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse("Incorrect password", null));
            }
            userService.deleteUserAndData(user);
            logger.info("Account deleted successfully for user: {}", user.getUsername());
            return ResponseEntity.ok(new AuthResponse("Account deleted successfully", null));
        } catch (Exception e) {
            logger.error("Account deletion failed", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Account deletion failed: " + e.getMessage(), null));
        }
    }
}
