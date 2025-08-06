package com.workflow.DTO.response;

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
public class UserResponseDto { //보내는거

    private Long userId;

    private String name;

    private String email;

    private Long teamId;

    private String teamName;

    private Long positionId;

    private String positionName;

    private ROLE role;

    private USERSTATUS status;

}
