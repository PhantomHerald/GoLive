package com.golive.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Embeddable
public class StreamViewerId implements Serializable {
    private static final long serialVersionUID = 1787094531903820752L;
    @NotNull
    @Column(name = "stream_id", nullable = false)
    private Integer streamId;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        StreamViewerId entity = (StreamViewerId) o;
        return Objects.equals(this.streamId, entity.streamId) &&
                Objects.equals(this.userId, entity.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(streamId, userId);
    }

}