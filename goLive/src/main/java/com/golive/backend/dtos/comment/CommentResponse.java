package com.golive.backend.dtos.comment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponse {
    private Integer id;
    private String message;
    private Instant createdAt;
    private Integer userId;
    private Integer videoId;
    private Integer streamId;
}
