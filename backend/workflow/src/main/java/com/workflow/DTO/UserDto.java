package com.workflow.DTO;

import com.workflow.constants.ROLE;
import com.workflow.constants.USERSTATUS;
import com.workflow.entity.Team;
import com.workflow.entity.Position;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    private Long userId;

    private String password;

    private String name;

    private String email;

    private TeamDto team;

    private PositionDto position;

    private ROLE role;

    private USERSTATUS status;
}
