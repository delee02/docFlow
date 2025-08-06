package com.workflow.repository;

import com.workflow.entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PositionRepository extends JpaRepository<Position, Long> {
    boolean existsByPositionName(String positionName);
}
