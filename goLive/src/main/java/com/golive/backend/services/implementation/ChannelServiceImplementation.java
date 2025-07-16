package com.golive.backend.services.implementation;

import com.golive.backend.dtos.channel.ChannelDto;
import com.golive.backend.dtos.channel.ChannelResponse;
import com.golive.backend.entities.Channel;
import com.golive.backend.mappers.ChannelMapper;
import com.golive.backend.repositries.ChannelRepository;
import com.golive.backend.services.ChannelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class ChannelServiceImplementation  implements ChannelService {
    private final ChannelRepository channelRepository;
    private final ChannelMapper channelMapper;

    @Override
    public ChannelDto createChannel(ChannelDto channelDto) {
        Channel channel = channelMapper.toEntity(channelDto);
        return channelMapper.toDto(channelRepository.save(channel));
    }

    @Override
    public ChannelDto updateChannel(Integer id, ChannelDto channelDto) {
        Optional<Channel> optionalChannel = channelRepository.findById(id);
        if (optionalChannel.isPresent()) {
            Channel channel = optionalChannel.get();
            channel.setName(channelDto.getName());
            channel.setDescription(channelDto.getDescription());
            return channelMapper.toDto(channelRepository.save(channel));
        }
        throw new RuntimeException("Channel not found");
    }

    @Override
    public void deleteChannel(Integer id) {
        channelRepository.deleteById(id);
    }

    @Override
    public ChannelDto getChannelById(Integer id) {
        Channel channel = channelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Channel not found"));
        return channelMapper.toDto(channel);
    }

    @Override
    public List<ChannelDto> getAllChannels() {
        List<Channel> channels = StreamSupport
                .stream(channelRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
        return channelMapper.toDtoList(channels);
    }



    @Override
    public ChannelResponse getChannelResponse(Integer id) {
        Channel channel = channelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Channel not found"));
        return channelMapper.toResponse(channel);
    }
}
