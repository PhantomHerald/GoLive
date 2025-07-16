package com.golive.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "videos")
public class Video {
    @Id
    @ColumnDefault("nextval('videos_id_seq')")
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "channel_id", nullable = false)
    private Channel channel;

    @Size(max = 150)
    @Column(name = "title", length = 150)
    private String title;

    @NotNull
    @Column(name = "url", nullable = false, length = Integer.MAX_VALUE)
    private String url;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "uploaded_at")
    private Instant uploadedAt;

    @Column(name = "is_public")
    private boolean isPublic;


}