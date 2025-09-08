package com.workflow.DTO.request;

import com.workflow.constants.MESSAGETYPE;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SystemMessageRequest {
    private Long roomId;
    private Long senderId;
    private Long documentId;
    private String title;
    private String docType;
    private MESSAGETYPE type;
    private Instant createdAt;
}
