package com.GoLive.GoLiveBackend;

import java.io.Serializable;
import java.util.Objects;

public class StreamCategoriesId implements Serializable {
    private Long streamId;
    private Integer categoryId;

    public StreamCategoriesId() {}

    public StreamCategoriesId(Long streamId, Integer categoryId) {
        this.streamId = streamId;
        this.categoryId = categoryId;
    }

    public Long getStreamId() {
        return streamId;
    }

    public void setStreamId(Long streamId) {
        this.streamId = streamId;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StreamCategoriesId that = (StreamCategoriesId) o;
        return Objects.equals(streamId, that.streamId) && Objects.equals(categoryId, that.categoryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(streamId, categoryId);
    }
} 