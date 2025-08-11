package com.workflow.controller;

import com.workflow.DTO.request.MentionRequest;
import com.workflow.DTO.response.UserResponseDto;
import com.workflow.config.JwtUtil;
import com.workflow.entity.User;
import com.workflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")

public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    //회사 직원 다 불러오기
    @GetMapping("/list")
    public ResponseEntity<List<MentionRequest>> getUsers() {
        List<MentionRequest> users = userService.getUsers();
        System.out.println("보내는것드 "+users);
        return ResponseEntity.ok(users);
    }

    //내정보
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getMe(@RequestHeader("Authorization") String authorizationHeader){
        UserResponseDto getMe = new UserResponseDto();
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7); // "Bearer " 접두사 제거
            String email = jwtUtil.getEmailFromToken(token);
            System.out.println( "Protected resource accessed with token: " + email);
            getMe = userService.getMe(email);
        } else {
            System.out.println( "Unauthorized");
        }
        return ResponseEntity.ok(getMe);
    }

}
