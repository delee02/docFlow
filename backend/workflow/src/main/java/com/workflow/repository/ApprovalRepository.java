package com.workflow.repository;

import com.workflow.entity.ApprovalLine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApprovalRepository extends JpaRepository<ApprovalLine, Long> {
    List<ApprovalLine> findAllByUserIdAndStatusIsNotNull(Long userId);
}
