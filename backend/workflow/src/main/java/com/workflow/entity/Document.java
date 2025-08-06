package com.workflow.entity;

import com.workflow.constants.DOCUMENTSTATUS;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "document")
@Getter
@Setter
@ToString
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String type;
    private Long writeId;

    @Enumerated(EnumType.STRING)
    private DOCUMENTSTATUS status;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL)
    private List<ApprovalLine> approvalLines = new ArrayList<>();
}
