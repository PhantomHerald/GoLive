package com.golive.backend.mappers;


import com.golive.backend.dtos.user.UserDto;
import com.golive.backend.entities.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto (User user);
    User toEntity (UserDto dto);
    List <UserDto> toDtoList (List<User> users);
}
