package com.golive.backend.dtos.channel;

import lombok.Data;

@Data
public class ChannelResponse {
    private String username;
    private String bio;
    private String bannerUrl;
    private String profilePictureUrl;
    private int streamCount;
    private int followerCount;
    private String currentCategory;
    private boolean isLive;
}
