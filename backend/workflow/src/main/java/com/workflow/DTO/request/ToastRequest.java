package com.workflow.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ToastRequest {
    private Long roomId;
    private Long senderId;
    private String senderName;
    private String content;
    private Instant createdAt;

}
