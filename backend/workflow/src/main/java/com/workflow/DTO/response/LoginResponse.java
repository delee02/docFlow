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
    private Long userId;

    //싸인 저장되어있는지 여부
    private boolean haveSign;
}
