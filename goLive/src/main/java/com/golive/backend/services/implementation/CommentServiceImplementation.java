package com.golive.backend.services.implementation;

import com.golive.backend.dtos.comment.CommentDto;
import com.golive.backend.dtos.comment.CommentResponse;
import com.golive.backend.entities.Comment;
import com.golive.backend.mappers.CommentMapper;
import com.golive.backend.repositries.CommentRepository;
import com.golive.backend.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImplementation implements CommentService {
    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;

    @Override
    public CommentResponse addComment(CommentDto commentDto) {
        Comment comment = commentMapper.toEntity(commentDto);
        return commentMapper.toResponse(commentRepository.save(comment));
    }

    @Override
    public List<CommentResponse> getCommentsByVideoId(Integer videoId) {
        return commentMapper.toResponseList(commentRepository.findByVideoId(videoId));
    }

    @Override
    public void deleteComment(Integer id) {
        commentRepository.deleteById(id);
    }

}
