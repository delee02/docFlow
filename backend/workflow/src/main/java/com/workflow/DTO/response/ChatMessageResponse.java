package com.workflow.DTO.response;

import com.workflow.constants.MESSAGETYPE;
import com.workflow.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageResponse {
    private Long id;
    private Long roomId;
    private Long senderId;
    //private Long senderName;
    private String content;
    private MESSAGETYPE type;
    private LocalDateTime createdAt;
}