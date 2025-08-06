package com.workflow.DTO.response;

import com.workflow.constants.ROLE;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String name;
    private ROLE role;
}
