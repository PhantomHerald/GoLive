package com.golive.backend.services;

import com.golive.backend.dtos.stream.StreamDto;

import java.util.List;

public interface StreamService {
    List<StreamDto> getAllLiveStreams();
    StreamDto getStreamById(Integer id);
    StreamDto startStream(StreamDto streamDto);
    StreamDto endStream(Integer streamId);
    List<StreamDto> getStreamsByChannelId(Integer channelId);
    StreamDto updateStreamTitle(Integer streamId, String newTitle);
}
