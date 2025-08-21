package com.workflow.repository;

import com.workflow.constants.APPROVALSTATUS;
import com.workflow.entity.ApprovalLine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApprovalRepository extends JpaRepository<ApprovalLine, Long> {
    List<ApprovalLine> findAllByUserIdAndStatusIsNotNull(Long userId);

    //pending->approved 바꾸기 위해 가져오는
    Optional<ApprovalLine> findByUserIdAndDocumentIdAndStatus(Long userId, Long DocumentId, APPROVALSTATUS status);

    //다음 결재자 가져옴
    Optional<ApprovalLine> findByDocumentIdAndApprovalOrder(Long documentId, int approvalOrder);
}
