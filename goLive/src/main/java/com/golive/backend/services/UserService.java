package com.golive.backend.services;

import com.golive.backend.dtos.user.UserDto;

public interface UserService {
    UserDto registerUser (String firebaseToken);
    UserDto getUserByUsername(String username);
    UserDto getUserByToken(String firebaseToken);              // NEW
    UserDto updateCurrentUser(String firebaseToken, UserDto updatedUser); // NEW

}
