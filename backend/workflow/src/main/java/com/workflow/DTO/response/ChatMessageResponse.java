package com.workflow.DTO.response;

import com.workflow.constants.MESSAGETYPE;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.Instant;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageResponse {
    private Long id;
    private Long roomId;
    private Long senderId;
    private String senderName;
    private String content;
    private MESSAGETYPE type;
    private Instant createdAt;

}