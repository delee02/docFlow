package com.workflow.controller;

import com.workflow.DTO.PositionDto;
import com.workflow.DTO.TeamDto;
import com.workflow.DTO.request.UserRequestDto;
import com.workflow.DTO.response.UserResponseDto;
import com.workflow.entity.Team;
import com.workflow.repository.PositionRepository;
import com.workflow.repository.TeamRepository;
import com.workflow.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;
    private final TeamRepository teamRepository;
    private final PositionRepository positionRepository;

    //회사 직원 다 불러오기
    @GetMapping("/user/list")
    public ResponseEntity<List<UserResponseDto>> getUsers() {
        List<UserResponseDto> users = adminService.userDtoList();
        return ResponseEntity.ok(users);
    }

    //특정 유저 가져오기
    @GetMapping("/user/{userId}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable Long userId){
        UserResponseDto user = adminService.getUser(userId);
        return ResponseEntity.ok(user);
    }

    //새로운 유저 추가
    @PostMapping("/user/new")
    public ResponseEntity<String> createUser(@RequestBody UserRequestDto userRequestDto){
        System.out.println("가져온 거"+userRequestDto);
        boolean user = adminService.createUser(userRequestDto);

        if(user){
            return ResponseEntity.ok("Creating user success");
        }else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Creating user failed");
        }
    }

    //유저 수정
    @PostMapping("/user/edit/{userId}")
    public ResponseEntity<String> updateUser(@PathVariable Long userId, @RequestBody UserRequestDto userRequestDto) {
        try {
            userRequestDto.setUserId(userId);
            adminService.updateUser(userRequestDto);
            return ResponseEntity.ok("수정 성공");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //총 유저 수 가져오기
    @GetMapping("user/count")
    public ResponseEntity<String> countUser(){
        try{
            Long count = adminService.userCount();
            System.out.println("count: "+ count);
            return ResponseEntity.ok(String.valueOf(count));
        }catch (Exception e){
            System.out.println("총 인원 가져오지 못했습니다.");
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //팀 리스트
    @GetMapping("/team/list")
    public ResponseEntity<List<Team>> getTeams() {
        List<Team> teams = teamRepository.findAll();
        return ResponseEntity.ok(teams);
    }

    //새로운 팀 추가
    @PostMapping("/team/new")
    public ResponseEntity<String> createTeam(@RequestBody TeamDto teamDto){
        System.out.println("가져온 거"+teamDto);
        boolean user = adminService.createTeam(teamDto.getTeamName());

        if(user){
            return ResponseEntity.ok("Creating team success");
        }else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Creating team failed");
        }
    }

    //팀 수정
    @PostMapping("/team/edit/{teamId}")
    public ResponseEntity<String> updateTeam(@PathVariable Long teamId, @RequestBody TeamDto teamDto) {
        try {
            teamDto.setTeamId(teamId);
            adminService.updateTeam(teamDto);
            return ResponseEntity.ok("수정 성공");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //직책 리스트
    @GetMapping("/position/list")
    public ResponseEntity<List<PositionDto>> getPositions() {
        List<PositionDto> positions = adminService.getPositionList();
        return ResponseEntity.ok(positions);
    }

    //새로운 직책 추가
    @PostMapping("/position/new")
    public ResponseEntity<String> createPosition(@RequestBody PositionDto positionDto){
        System.out.println("가져온 거"+positionDto);
        boolean user = adminService.createPosition(positionDto);

        if(user){
            return ResponseEntity.ok("Creating position success");
        }else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Creating position failed");
        }
    }

    //position 수정
    @PostMapping("/position/edit/{positionId}")
    public ResponseEntity<String> updatePosition(@PathVariable Long positionId, @RequestBody PositionDto positionDto) {
        try {
            positionDto.setPositionId(positionId);
            adminService.updatePosition(positionDto);
            return ResponseEntity.ok("수정 성공");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
