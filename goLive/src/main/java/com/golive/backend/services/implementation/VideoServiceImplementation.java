package com.golive.backend.services.implementation;

import com.golive.backend.dtos.video.VideoDTO;
import com.golive.backend.entities.Video;
import com.golive.backend.mappers.VideoMapper;
import com.golive.backend.repositries.VideoRepository;
import com.golive.backend.services.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoServiceImplementation implements VideoService {
    private final VideoRepository videoRepository;
    private final VideoMapper videoMapper;

    @Override
    public VideoDTO uploadVideo(VideoDTO videoDto) {
        Video video = videoMapper.toEntity(videoDto);
        video.setUploadedAt(Instant.now());
        Video saved = videoRepository.save(video);
        return videoMapper.toDto(saved);
    }

    @Override
    public List<VideoDTO> getAllVideos() {
        return videoRepository.findAll()
                .stream()
                .map(videoMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public VideoDTO getVideoById(Integer id) {
        return videoRepository.findById(id)
                .map(videoMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Video not found"));
    }

    @Override
    public List<VideoDTO> getVideosByChannelId(Integer channelId) {
        return videoRepository.findByChannelId(channelId)
                .stream()
                .map(videoMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteVideo(Integer id) {
        if (!videoRepository.existsById(id)) {
            throw new RuntimeException("Video not found");
        }
        videoRepository.deleteById(id);
    }

    //Edits or update video information
//    @Override
//    public VideoDTO updateVideo(Integer id, VideoDTO videoDto) {
//        Video video = videoRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Video not found"));
//
//        video.setTitle(videoDto.getTitle());
//        video.setDescription(videoDto.getDescription());
//        video.setUrl(videoDto.getUrl());
//        video.setThumbnail(videoDto.getThumbnail());
//        video.setChannel(videoDto.getChannel()); // or use mapper if needed
//
//        Video updated = videoRepository.save(video);
//        return videoMapper.toDto(updated);
//    }

}
