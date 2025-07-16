package com.golive.backend.controllers.comment;

import com.golive.backend.dtos.comment.CommentDto;
import com.golive.backend.dtos.comment.CommentResponse;
import com.golive.backend.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    // Add a new comment
    @PostMapping
    public ResponseEntity<CommentResponse> addComment(@RequestBody CommentDto commentDto) {
        return ResponseEntity.ok(commentService.addComment(commentDto));
    }

    // Get all comments for a video
    @GetMapping("/video/{videoId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByVideo(@PathVariable Integer videoId) {
        return ResponseEntity.ok(commentService.getCommentsByVideoId(videoId));
    }

    // Delete a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Integer id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
