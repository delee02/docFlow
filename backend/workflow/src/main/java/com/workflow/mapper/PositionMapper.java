package com.workflow.mapper;

import com.workflow.DTO.PositionDto;
import com.workflow.entity.Position;
import org.springframework.stereotype.Component;

@Component

public class PositionMapper {

    public PositionDto toDto(Position position) {
        if (position == null) return null;

        return PositionDto.builder()
                .positionId(position.getPositionId())
                .positionName(position.getPositionName())
                .build();
    }

    public Position toEntity(PositionDto dto){
        if(dto == null) return null;

        Position position = new Position();
        position.setPositionId(dto.getPositionId());
        position.setPositionName(dto.getPositionName());

        return position;
    }
}
