package com.workflow.DTO.response;

import com.workflow.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomResponse {
    private Long id;
    private String name;
    private List<ChatMessage> messages;
}
