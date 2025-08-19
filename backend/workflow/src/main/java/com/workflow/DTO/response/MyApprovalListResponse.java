package com.workflow.DTO.response;

import com.workflow.DTO.request.WriterRequest;
import com.workflow.constants.DOCUMENTSTATUS;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyApprovalListResponse {
    private Long id;
    private String title;
    private String templateType;
    private Long writerId;
    private String writerName;
    private DOCUMENTSTATUS status;
}
