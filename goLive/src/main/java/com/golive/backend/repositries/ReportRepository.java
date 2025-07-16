package com.golive.backend.repositries;

import com.golive.backend.entities.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
    Optional<Report> findById(int id);
}
