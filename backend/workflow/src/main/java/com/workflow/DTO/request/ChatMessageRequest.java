package com.workflow.DTO.request;

import com.workflow.constants.MESSAGETYPE;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageRequest {
    private Long roomId;
    private Long senderId;
    private String content;
    private MESSAGETYPE type;
    private LocalDateTime createdAt;
}