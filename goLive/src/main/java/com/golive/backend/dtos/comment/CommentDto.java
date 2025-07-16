package com.golive.backend.dtos.comment;

import lombok.Data;

import java.time.Instant;

@Data
public class CommentDto {
    private Integer id;
    private String content;
    private Instant createdAt;
    private Integer userId;
    private Integer videoId;
}
