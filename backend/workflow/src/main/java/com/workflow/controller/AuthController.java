package com.workflow.controller;

import com.workflow.DTO.TeamDto;
import com.workflow.DTO.request.LoginRequest;
import com.workflow.DTO.request.UserRequestDto;
import com.workflow.DTO.response.LoginResponse;
import com.workflow.DTO.response.UserResponseDto;
import com.workflow.config.JwtUtil;
import com.workflow.entity.Position;
import com.workflow.entity.Team;
import com.workflow.entity.User;
import com.workflow.mapper.UserMapper;
import com.workflow.repository.PositionRepository;
import com.workflow.repository.TeamRepository;
import com.workflow.repository.UserRepository;
import com.workflow.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AdminService userService;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final PositionRepository positionRepository;
    private final UserMapper userMapper;

    //로그인
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request){
        System.out.println("로그인 시도: " + request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        System.out.println("인증 성공");

        String token = jwtUtil.generateToken(request.getEmail());
        System.out.println("토큰 생성 완료");

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("유저 없음"));
        System.out.println("유저 조회 완료: " + user.getName());

        return ResponseEntity.ok(new LoginResponse(token, user.getName(), user.getRole(), user.getUserId()));
    }



}
