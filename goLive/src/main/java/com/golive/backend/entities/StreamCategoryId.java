package com.golive.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class StreamCategoryId implements Serializable {
    private static final long serialVersionUID = 2565748799230389469L;
    @NotNull
    @Column(name = "stream_id", nullable = false)
    private Integer streamId;

    @NotNull
    @Column(name = "category_id", nullable = false)
    private Integer categoryId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        StreamCategoryId entity = (StreamCategoryId) o;
        return Objects.equals(this.streamId, entity.streamId) &&
                Objects.equals(this.categoryId, entity.categoryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(streamId, categoryId);
    }

}