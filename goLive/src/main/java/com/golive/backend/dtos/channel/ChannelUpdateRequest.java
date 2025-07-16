package com.golive.backend.dtos.channel;

import lombok.Data;

@Data
public class ChannelUpdateRequest {
    private String id;
    private String name;
    private String description;
    private String url;
    private String bannerUrl;
}
