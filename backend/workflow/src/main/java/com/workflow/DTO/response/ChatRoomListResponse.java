package com.workflow.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomListResponse {
    private Long id;
    private String name;
    private String content;
    private Instant time;
    private int unReadMessage;
}
