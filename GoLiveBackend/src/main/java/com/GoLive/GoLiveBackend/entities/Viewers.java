package com.GoLive.GoLiveBackend.entities;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "viewers")
public class Viewers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "stream_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "viewers_stream_id_fkey"), nullable = true)
    private Stream stream;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "viewers_user_id_fkey"), nullable = true)
    private User user;

    @Column(name = "joined_at", nullable = false, updatable = false, insertable = false, columnDefinition = "timestamp default CURRENT_TIMESTAMP")
    private Timestamp joinedAt;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Stream getStream() {
        return stream;
    }

    public void setStream(Stream stream) {
        this.stream = stream;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Timestamp getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Timestamp joinedAt) {
        this.joinedAt = joinedAt;
    }
}