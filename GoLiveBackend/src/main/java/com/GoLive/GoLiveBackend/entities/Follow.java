package com.GoLive.GoLiveBackend.entities;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "follows", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "follower_id", "followed_id" })
})
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", nullable = false)
    private User follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "followed_id", nullable = false)
    private User followed;

    @Column(name = "followed_at", nullable = false, updatable = false)
    private Timestamp followedAt = new Timestamp(System.currentTimeMillis());

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getFollower() {
        return follower;
    }

    public void setFollower(User follower) {
        this.follower = follower;
    }

    public User getFollowed() {
        return followed;
    }

    public void setFollowed(User followed) {
        this.followed = followed;
    }

    public Timestamp getFollowedAt() {
        return followedAt;
    }

    public void setFollowedAt(Timestamp followedAt) {
        this.followedAt = followedAt;
    }

    @Override
    public String toString() {
        return "Follow{" +
                "id=" + id +
                ", follower=" + (follower != null ? follower.getUsername() : "null") +
                ", followed=" + (followed != null ? followed.getUsername() : "null") +
                ", followedAt=" + followedAt +
                '}';
    }
}