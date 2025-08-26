package com.workflow.repository;

import com.workflow.entity.DocumentSign;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SignatureRepository extends JpaRepository<DocumentSign, Long> {
    Optional<DocumentSign> findBySigner_UserId(Long userId);
}
