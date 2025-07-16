package com.golive.backend.mappers;

import com.golive.backend.dtos.stream.StreamDto;
import com.golive.backend.entities.Stream;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper (componentModel = "spring")
public interface StreamMapper {
//  @Mapping(source = "channel.user.username", target = "streamerUsername")
//  @Mapping(source = "channel.category.name", target = "category")
    StreamDto toDto(Stream stream);
    Stream toEntity (StreamDto streamDto);

    List<StreamDto> toDto(List<Stream> streams);
}
