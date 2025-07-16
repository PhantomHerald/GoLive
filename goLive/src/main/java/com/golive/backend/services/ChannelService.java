package com.golive.backend.services;

import com.golive.backend.dtos.channel.ChannelDto;
import com.golive.backend.dtos.channel.ChannelResponse;

import java.util.List;

public interface ChannelService {
    ChannelDto createChannel(ChannelDto channelDto);
    ChannelDto updateChannel(Integer id, ChannelDto channelDto);
    void deleteChannel(Integer id);
    ChannelDto getChannelById(Integer id);
    List<ChannelDto> getAllChannels();
    ChannelResponse getChannelResponse(Integer id);
}
