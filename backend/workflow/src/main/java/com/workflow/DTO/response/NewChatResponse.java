package com.workflow.DTO.response;

import com.workflow.constants.ROOMTYPE;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewChatResponse {
    private Long id;
    private String name;
    private ROOMTYPE type;
    private Instant time;
}
