package com.golive.backend.services;

import com.golive.backend.dtos.comment.CommentDto;
import com.golive.backend.dtos.comment.CommentResponse;

import java.util.List;

public interface CommentService {
    CommentResponse addComment(CommentDto commentDto);
    List<CommentResponse> getCommentsByVideoId(Integer videoId);
    void deleteComment(Integer id);
}
