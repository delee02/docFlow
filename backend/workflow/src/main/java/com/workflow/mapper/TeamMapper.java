package com.workflow.mapper;

import com.workflow.DTO.TeamDto;
import com.workflow.entity.Team;
import org.springframework.stereotype.Component;

@Component
public class TeamMapper {

    public TeamDto toDto(Team team) {
        if (team == null) return null;

        return TeamDto.builder()
                .teamId(team.getTeamId())
                .teamName(team.getTeamName())
                .build();
    }

    public Team toEntity(TeamDto dto){
        if(dto == null) return null;

        Team team = new Team();
        team.setTeamId(dto.getTeamId());
        team.setTeamName(dto.getTeamName());

        return team;
    }
}
