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
    @Column(columnDefinition = "LONGTEXT")
    private String content;

    //나중에 팀이동, 승진해도 예전에 썼던 문서들은 바뀌면 안되기 때문에 중복정보이지만 저장해놓음
    private Long writeId;
    private String writerName;
    private String writerPosition;
    private String writerTeam;

    @Enumerated(EnumType.STRING)
    private DOCUMENTSTATUS status;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval=true)
    private List<ApprovalLine> approvalLines = new ArrayList<>();
}
