package com.golive.backend.mappers;

import com.golive.backend.dtos.comment.CommentDto;
import com.golive.backend.dtos.comment.CommentResponse;
import com.golive.backend.entities.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper (componentModel = "spring")
public interface CommentMapper {
    Comment toEntity(CommentDto dto);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "video.id", target = "videoId")
    @Mapping(source = "stream.id", target = "streamId")
    CommentResponse toResponse(Comment comment);

    List<CommentResponse> toResponseList(List<Comment> comments);
}
