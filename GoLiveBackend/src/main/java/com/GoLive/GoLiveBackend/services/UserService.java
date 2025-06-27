package com.GoLive.GoLiveBackend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(AuthRequest request) {
        logger.info("Registering user: {}", request.getUsername());

        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User with email " + request.getEmail() + " already exists");
        }

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username " + request.getUsername() + " already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setBirthMonth(request.getBirthMonth());
        user.setBirthDay(request.getBirthDay());
        user.setBirthYear(request.getBirthYear());

        // Hash the password before saving
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(hashedPassword);

        logger.info("Password hashed successfully for user: {}", request.getUsername());
        logger.debug("Original password length: {}, Hashed password length: {}",
                request.getPassword().length(), hashedPassword.length());

        User savedUser = userRepository.save(user);
        logger.info("User saved successfully: {}", savedUser);

        return savedUser;
    }

    public User authenticateUser(String email, String password) throws Exception {
        logger.info("Authenticating user with email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("User not found"));

        logger.debug("User found: {}", user.getUsername());

        // Verify password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            logger.warn("Invalid password for user: {}", email);
            throw new Exception("Invalid password");
        }

        logger.info("Authentication successful for user: {}", user.getUsername());
        return user;
    }

    public User authenticateUserByEmailOrUsername(String identifier, String password) throws Exception {
        logger.info("Authenticating user with identifier: {}", identifier);

        User user = userRepository.findByEmailOrUsername(identifier)
                .orElseThrow(() -> new Exception("User not found"));

        logger.debug("User found: {}", user.getUsername());

        // Verify password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            logger.warn("Invalid password for user: {}", identifier);
            throw new Exception("Invalid password");
        }

        logger.info("Authentication successful for user: {}", user.getUsername());
        return user;
    }

    public User updateUser(User user) {
        logger.info("Updating user: {}", user.getUsername());
        User updatedUser = userRepository.save(user);
        logger.info("User updated successfully: {}", updatedUser.getUsername());
        return updatedUser;
    }

    public User validateToken(String token) throws Exception {
        logger.info("Validating token");

        User user = userRepository.findByRefreshToken(token)
                .orElseThrow(() -> new Exception("Invalid token"));

        logger.info("Token validated for user: {}", user.getUsername());
        return user;
    }

    public User updateUserBio(String token, String newBio) throws Exception {
        logger.info("Updating bio for user with token");

        User user = userRepository.findByRefreshToken(token)
                .orElseThrow(() -> new Exception("Invalid token"));

        // Set bio to null if it's empty or null, otherwise use the provided bio
        if (newBio == null || newBio.trim().isEmpty()) {
            user.setBio(null);
            logger.info("Bio cleared for user: {}", user.getUsername());
        } else {
            user.setBio(newBio.trim());
            logger.info("Bio updated for user: {}", user.getUsername());
        }
        
        User updatedUser = userRepository.save(user);

        logger.info("Bio update completed successfully for user: {}", updatedUser.getUsername());
        return updatedUser;
    }

    public User getUserById(Long userId) throws Exception {
        logger.info("Getting user by ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));
        logger.info("User found: {}", user.getUsername());
        return user;
    }
}
