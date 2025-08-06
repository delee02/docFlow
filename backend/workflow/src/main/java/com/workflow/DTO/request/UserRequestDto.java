package com.workflow.DTO.request;

import com.workflow.DTO.PositionDto;
import com.workflow.DTO.TeamDto;
import com.workflow.constants.ROLE;
import com.workflow.constants.USERSTATUS;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRequestDto { //받아오는거
    private Long userId;

    private String password;

    private String name;

    private String email;

    private Long teamId;

    private Long positionId;

    private ROLE role;

    private USERSTATUS status;
}
