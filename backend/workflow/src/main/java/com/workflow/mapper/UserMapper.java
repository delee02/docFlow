package com.workflow.mapper;

import com.workflow.DTO.PositionDto;
import com.workflow.DTO.TeamDto;
import com.workflow.DTO.UserDto;
import com.workflow.entity.Position;
import com.workflow.entity.Team;
import com.workflow.entity.User;
import com.workflow.repository.PositionRepository;
import com.workflow.repository.TeamRepository;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {
    private final TeamMapper teamMapper;
    private final PositionMapper positionMapper;
    private final TeamRepository teamRepository;
    private final PositionRepository positionRepository;

    public UserDto toDto(User user){
        if(user == null) return null;
        TeamDto teamDto = teamMapper.toDto(user.getTeam());
        PositionDto positionDto = positionMapper.toDto(user.getPosition());

        return UserDto.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .team(teamDto)
                .role(user.getRole())
                .password(user.getPassword())
                .status(user.getStatus())
                .position(positionDto)
                .build();
    }

    public User toEntity(UserDto dto){
        if(dto == null) return null;
        Team team = teamRepository.findById(dto.getTeam().getTeamId()).orElseThrow(() -> new IllegalArgumentException("팀 찾기 실패"));
        Position position = positionRepository.findById(dto.getPosition().getPositionId()).orElseThrow(() -> new IllegalArgumentException("직책찾기 실패"));

        User user = new User();
        user.setUserId(dto.getUserId());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        user.setPassword(dto.getPassword());
        user.setStatus(dto.getStatus());
        user.setTeam(team);
        user.setPosition(position);

        return user;
    }
}
