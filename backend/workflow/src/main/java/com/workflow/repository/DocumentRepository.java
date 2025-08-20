package com.workflow.repository;

import com.workflow.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findAllByWriteId(Long userId);

    @Query("SELECT DISTINCT d FROM Document d JOIN d.approvalLines a " +
            "WHERE a.userId = :userId AND a.status IS NOT NULL")
    List<Document> findAllMyApproval(Long userId);
}
