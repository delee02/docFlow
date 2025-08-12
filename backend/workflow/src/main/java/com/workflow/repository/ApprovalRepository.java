package com.workflow.repository;

import com.workflow.entity.ApprovalLine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApprovalRepository extends JpaRepository<ApprovalLine, Long> {
}
