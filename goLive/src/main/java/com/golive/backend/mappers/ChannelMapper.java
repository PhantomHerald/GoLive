package com.golive.backend.mappers;

import com.golive.backend.dtos.channel.ChannelDto;
import com.golive.backend.dtos.channel.ChannelResponse;
import com.golive.backend.entities.Channel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper (componentModel = "spring")
public interface ChannelMapper {
//    @Mapping(source = "user.username", target = "username")
//    @Mapping(source = "user.profilePictureUrl", target = "profilePictureUrl")
//    @Mapping(source = "category.name", target = "currentCategory")

    ChannelDto toDto(Channel channel);
    Channel toEntity(ChannelDto dto);
    List<ChannelDto> toDtoList(List<Channel> channels);


    ChannelResponse toResponse(Channel channel);
    List <ChannelResponse> toResponseList(List<Channel> channels);


}
