package com.workflow.entity;

import com.workflow.constants.APPROVALSTATUS;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table(name = "approvalLine")
@Getter
@Setter
@ToString
public class ApprovalLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="document_id")
    private Document document;

    private Long approvalId;
    private int approvalOrder; // 결재자 순서

    @Enumerated(EnumType.STRING)
    private APPROVALSTATUS status;

    private LocalDateTime approvedAt;
    private  String comment;
}
