package com.golive.backend.services.implementation;


import com.golive.backend.dtos.user.UserDto;
import com.golive.backend.entities.User;
import com.golive.backend.mappers.UserMapper;
import com.golive.backend.repositries.UserRepository;
import com.golive.backend.security.FirebaseService;
import com.golive.backend.services.UserService;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public  class UserServiceImplementation implements UserService {
    private final UserRepository userRepository;
    private final FirebaseService firebaseService;
    private final UserMapper userMapper;

    public UserServiceImplementation(UserRepository userRepository,
                                     FirebaseService firebaseService,
                                     UserMapper userMapper) {
        this.userRepository = userRepository;
        this.firebaseService = firebaseService;
        this.userMapper = userMapper;
    }

    @Override
    public UserDto registerUser(String firebaseToken) {
        FirebaseToken token = firebaseService.verifyToken(firebaseToken);
        String uid = token.getUid();
        String email = token.getEmail();

        Optional<User> existingUser = userRepository.findByUsername(uid);

        if (existingUser.isPresent()) {
            return userMapper.toDto(existingUser.get());
        }

        User newUser = new User();
        newUser.setUsername(uid);
        newUser.setEmail(email);
        newUser.setBio("New user");
        //newUser.setAvatarUrl("");

        userRepository.save(newUser);
        return userMapper.toDto(newUser);
    }

    @Override
    public UserDto getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(userMapper::toDto)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    //New added
    @Override
    public UserDto getUserByToken(String firebaseToken) {
        String uid = firebaseService.verifyToken(firebaseToken).getUid();
        User user = userRepository.findByUsername(uid)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toDto(user);
    }

    @Override
    public UserDto updateCurrentUser(String firebaseToken, UserDto updatedUser) {
        String uid = firebaseService.verifyToken(firebaseToken).getUid();
        User user = userRepository.findByUsername(uid)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update allowed fields
        user.setDisplayName(updatedUser.getDisplayName());
        user.setBio(updatedUser.getBio());
        user.setAvatarUrl(updatedUser.getAvatarUrl());

        userRepository.save(user);
        return userMapper.toDto(user);
    }

}
