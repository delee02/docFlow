package com.workflow.DTO.response;

import com.workflow.DTO.request.ApproverRequest;
import com.workflow.DTO.request.WriterRequest;
import com.workflow.constants.DOCUMENTSTATUS;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentResponse {
    private Long id;
    private String title;
    private String templateType;
    private String content;
    private WriterRequest writer;
    private DOCUMENTSTATUS status;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;

    List<ApproverRequest> approvers;
}
