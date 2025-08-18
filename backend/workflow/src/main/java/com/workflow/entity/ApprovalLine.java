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

    //나중에 팀이동, 승진해도 예전에 썼던 문서들은 바뀌면 안되기 때문에 중복정보이지만 저장해놓음
    private Long userId;
    private String name;
    private String positionName;
    private String teamName;
    private int approvalOrder;

    @Enumerated(EnumType.STRING)
    private APPROVALSTATUS status;

    private LocalDateTime approvedAt;
    private  String comment;
}
