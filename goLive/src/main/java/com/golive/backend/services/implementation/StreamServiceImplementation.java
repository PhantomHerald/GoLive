package com.golive.backend.services.implementation;

import com.golive.backend.dtos.stream.StreamDto;
import com.golive.backend.entities.Stream;
import com.golive.backend.mappers.StreamMapper;
import com.golive.backend.repositries.StreamRepository;
import com.golive.backend.services.StreamService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;


//Implements all the logic for stream-related features.
@Service
public class StreamServiceImplementation implements StreamService {
    private final StreamRepository streamRepository;
    private final StreamMapper streamMapper;

    public StreamServiceImplementation(StreamRepository streamRepository, StreamMapper streamMapper) {
        this.streamRepository = streamRepository;
        this.streamMapper = streamMapper;
    }

    //Fetch all streams that are currently live (isLive = true)
    @Override
    public List<StreamDto> getAllLiveStreams() {
        return streamRepository.findByIsLiveTrue()
                .stream()
                .map(streamMapper::toDto)
                .collect(Collectors.toList());
    }

    //Get a specific stream by its ID
    @Override
    public StreamDto getStreamById(Integer id) {
        Stream stream = streamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stream not found"));
        return streamMapper.toDto(stream);
    }

    //Start a new stream: set start time and mark as live

    @Override
    public StreamDto startStream(StreamDto streamDto) {
        Stream stream = streamMapper.toEntity(streamDto); // ✅ CORRECT
        stream.setStartTime(Instant.now());
        stream.setIsLive(true);
        Stream saved = streamRepository.save(stream);
        return streamMapper.toDto(saved);
    }


    //End a new stream
    @Override
    public StreamDto endStream(Integer streamId) {
        Stream stream = streamRepository.findById(streamId)
                .orElseThrow(() -> new RuntimeException("Stream not found"));
        stream.setEndTime(Instant.now());
        stream.setIsLive(false);
        streamRepository.save(stream);
        return streamMapper.toDto(stream);
    }


    //Get all streams associated with a specific channel
    @Override
    public List<StreamDto> getStreamsByChannelId(Integer channelId) {
        return streamRepository.findByChannelId(channelId)
                .stream()
                .map(streamMapper::toDto)
                .collect(Collectors.toList());
    }

    //Update the title of a stream
    @Override
    public StreamDto updateStreamTitle(Integer streamId, String newTitle) {
        Stream stream = streamRepository.findById(streamId)
                .orElseThrow(() -> new RuntimeException("Stream not found"));
        stream.setTitle(newTitle);
        streamRepository.save(stream);
        return streamMapper.toDto(stream);
    }

}
