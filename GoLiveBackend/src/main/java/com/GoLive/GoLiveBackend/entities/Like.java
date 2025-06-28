package com.GoLive.GoLiveBackend.entities;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "likes", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "stream_id" })
})
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stream_id", nullable = false)
    private Stream stream;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Stream getStream() {
        return stream;
    }

    public void setStream(Stream stream) {
        this.stream = stream;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Like{" +
                "id=" + id +
                ", user=" + (user != null ? user.getUsername() : "null") +
                ", stream=" + (stream != null ? stream.getId() : "null") +
                ", createdAt=" + createdAt +
                '}';
    }
}