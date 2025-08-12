package com.workflow.controller;

import com.workflow.DTO.request.UserListRequest;
import com.workflow.DTO.response.UserResponseDto;
import com.workflow.config.JwtUtil;
import com.workflow.service.ApprovalService;
import com.workflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/approval")
public class ApprovalController {
    private final ApprovalService approvalService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @GetMapping("/flowUser")
    public ResponseEntity<List<UserListRequest>>getFlowByDocument(@RequestParam String levels, @RequestHeader("Authorization") String authorizationHeader){
        List<UserListRequest> result = new ArrayList<>();

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7); // "Bearer " 접두사 제거
            String email = jwtUtil.getEmailFromToken(token);
            System.out.println( "Protected resource accessed with token: " + email);
            UserResponseDto userDto = userService.getMe(email);

            Long level = approvalService.getLevel(userDto.getEmail()).getPosition().getLevel();
          /*  List<Long> levelList = Arrays.stream(levels.split(","))
                    .map(Long::parseLong)
                    .collect(Collectors.toList());*/

            result = approvalService.getFlowByDoc(userDto.getTeamId(), (level-1));
            System.out.println("결과는 "+result);
        } else {
            System.out.println( "Unauthorized");
        }
        return ResponseEntity.ok(result);



    }
}
