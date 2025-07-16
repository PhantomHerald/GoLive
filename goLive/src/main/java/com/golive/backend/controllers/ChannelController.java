package com.golive.backend.controllers;

import com.golive.backend.dtos.channel.ChannelDto;
import com.golive.backend.services.ChannelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/channels")
@RequiredArgsConstructor
public class ChannelController {
    private final ChannelService channelService;

    //  Create a channel
    @PostMapping
    public ResponseEntity<ChannelDto> createChannel(@RequestBody ChannelDto channelDto) {
        return ResponseEntity.ok(channelService.createChannel(channelDto));
    }

    //  Get all channels
    @GetMapping
    public ResponseEntity<List<ChannelDto>> getAllChannels() {
        return ResponseEntity.ok(channelService.getAllChannels());
    }

    //  Get a specific channel by ID
    @GetMapping("/{id}")
    public ResponseEntity<ChannelDto> getChannelById(@PathVariable Integer id) {
        return ResponseEntity.ok(channelService.getChannelById(id));
    }

    // Update a channel
    @PutMapping("/{id}")
    public ResponseEntity<ChannelDto> updateChannel(@PathVariable Integer id, @RequestBody ChannelDto channelDto) {
        return ResponseEntity.ok(channelService.updateChannel(id, channelDto));
    }

    // Delete a channel
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChannel(@PathVariable Integer id) {
        channelService.deleteChannel(id);
        return ResponseEntity.noContent().build();
    }
}
