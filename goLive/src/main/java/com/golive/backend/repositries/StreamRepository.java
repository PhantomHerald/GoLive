package com.golive.backend.repositries;

import com.golive.backend.entities.Stream;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StreamRepository extends JpaRepository<Stream, Integer> {
    List<Stream> findByIsLiveTrue();
    List<Stream> findByChannelId(Integer channelId);
}
