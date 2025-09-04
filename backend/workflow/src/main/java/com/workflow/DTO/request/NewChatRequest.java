package com.workflow.DTO.request;

import com.workflow.constants.ROOMTYPE;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewChatRequest {
    private ROOMTYPE type;
    private String name;
    private List<Long> userIds;
}
