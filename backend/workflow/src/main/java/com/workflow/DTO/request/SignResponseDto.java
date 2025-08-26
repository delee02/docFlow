package com.workflow.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignResponseDto {
    private Long userId;
    private String imgUrl;
}
