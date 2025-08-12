package com.workflow.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserListRequest {
    private Long userId;
    private String teamName;
    private String positionName;
    private String name;
}
