package com.GoLive.GoLiveBackend.dtos;

public class BioUpdateRequest {
    private String bio;

    // Getters and Setters
    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    // Helper method to check if bio is effectively empty
    public boolean isBioEmpty() {
        return bio == null || bio.trim().isEmpty();
    }
}