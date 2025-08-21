package com.workflow.DTO.request;

import com.workflow.constants.DOCUMENTSTATUS;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentRequest {
    private Long documentId;
    private String title;
    private String templateType;
    private String content;
    private WriterRequest writer;
    private DOCUMENTSTATUS status;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;

    List<ApproverRequest> approvers;
}
