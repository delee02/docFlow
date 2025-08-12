package com.workflow.repository;

import com.workflow.entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PositionRepository extends JpaRepository<Position, Long> {
    boolean existsByPositionName(String positionName);

    List<Position> findAllByOrderByLevelAsc();
}
