package com.golive.backend.mappers;

import com.golive.backend.dtos.video.VideoDTO;
import com.golive.backend.dtos.video.VideoResponse;
import com.golive.backend.entities.Video;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper (componentModel = "spring")
public interface VideoMapper {
    VideoDTO toDto(Video video);

//    @Mapper(source = "channel.user.username", target = "channelName")
    VideoResponse toResponse(Video video);
    Video toEntity(VideoDTO dto);

    List <VideoDTO> toDtoList(List<Video> videos);
}
