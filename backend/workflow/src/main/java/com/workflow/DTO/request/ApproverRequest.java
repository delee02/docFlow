package com.workflow.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApproverRequest {
    private Long userId;
    private String name;
    private String teamName;
    private String positionName;
    private int approvalOrder;
    private String status;
}
