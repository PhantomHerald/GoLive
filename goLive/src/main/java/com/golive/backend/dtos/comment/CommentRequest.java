package com.golive.backend.dtos.comment;

import lombok.Data;

@Data
public class CommentRequest {
    private Long videoId;
    private Long userId;
    private String content;
}
