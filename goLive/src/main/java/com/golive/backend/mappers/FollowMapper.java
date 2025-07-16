package com.golive.backend.mappers;

import com.golive.backend.dtos.follow.FollowDTO;
import com.golive.backend.dtos.follow.FollowResponse;
import com.golive.backend.entities.Follow;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper (componentModel = "spring")
public interface FollowMapper {

    FollowDTO toDto(Follow follow);
    FollowResponse toResponse(Follow follow);

    // Tell MapStruct how to convert DTO into Follow entity
    @Mapping(target = "user.id", source = "userId")
    @Mapping(target = "channel.id", source = "followeeId") // or followeeId — depends on your logic
    @Mapping(target = "followedAt", expression = "java(java.time.Instant.now())")
    Follow toEntity(FollowDTO dto);

    List<FollowDTO> toDtoList(List<Follow> follows);
    List<FollowResponse> toResponseList(List<Follow> follows);
}
