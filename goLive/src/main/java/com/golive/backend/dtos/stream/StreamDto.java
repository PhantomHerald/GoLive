package com.golive.backend.dtos.stream;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.golive.backend.entities.Stream}
 */
@Value
public class StreamDto implements Serializable {
    Integer id;
    @NotNull
    ChannelDto channel;
    @Size(max = 150)
    String title;
    Instant startTime;
    Instant endTime;
    Boolean isLive;
}