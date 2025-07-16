package com.golive.backend.services;

import com.golive.backend.dtos.video.VideoDTO;

import java.util.List;

public interface VideoService {
    VideoDTO uploadVideo(VideoDTO videoDto);
    List<VideoDTO> getAllVideos();
    VideoDTO getVideoById(Integer id);
    List<VideoDTO> getVideosByChannelId(Integer channelId);
    void deleteVideo(Integer id);
    //VideoDTO updateVideo(Integer id, VideoDTO videoDto);

}
