package com.workflow.service;

import com.workflow.DTO.PositionDto;
import com.workflow.DTO.TeamDto;
import com.workflow.DTO.request.UserRequestDto;
import com.workflow.DTO.response.UserResponseDto;
import com.workflow.entity.Position;
import com.workflow.entity.Team;
import com.workflow.entity.User;
import com.workflow.mapper.PositionMapper;
import com.workflow.mapper.TeamMapper;
import com.workflow.mapper.UserMapper;
import com.workflow.repository.PositionRepository;
import com.workflow.repository.TeamRepository;
import com.workflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final PositionRepository positionRepository;
    private final PasswordEncoder passwordEncoder;

    //유저 생성
    public boolean createUser(UserRequestDto userRequestDto) {
        try {
            boolean email =userRepository.existsByEmail(userRequestDto.getEmail());
            System.out.println("중복검사" +email);

            //이메일 중복검사
            if(email){
               return false;
            }
            User user = RequestToUser(userRequestDto);
            userRepository.save(user);
            return true;
        }catch (Exception e ){
            System.out.println("새로운 사람 추가 못함");
            e.printStackTrace();
            return false;
        }
    }

    public UserResponseDto getUser(Long userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("유저 없음"));
        return toUserResponseDto(user);
    }

    //유저 수정
    public void updateUser(UserRequestDto userRequestDto){
        User user = userRepository.findById(userRequestDto.getUserId()).orElseThrow(()-> new IllegalArgumentException("유저없음"));
        Team team = teamRepository.findById(userRequestDto.getTeamId()).orElseThrow(() -> new IllegalArgumentException("팀 찾기 실패"));
        Position position = positionRepository.findById(userRequestDto.getPositionId()).orElseThrow(() -> new IllegalArgumentException("직책찾기 실패"));
        user.setRole(userRequestDto.getRole());
        user.setTeam(team);
        user.setPosition(position);
        user.setName(userRequestDto.getName());
        user.setStatus(userRequestDto.getStatus());
        String newPassword = userRequestDto.getPassword();
        if (newPassword != null && !newPassword.trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        userRepository.save(user);
    }

    //총 유저 가져오기
    public long userCount(){
        return userRepository.count();
    }

    //팀 추가
    public boolean createTeam(String teamName){
        try {
            boolean teamExist = teamRepository.existsByTeamName(teamName);
            if (teamExist) {
                System.out.println("같은 팀 이름 존재합니다.");
                return false;
            }
            Team team = new Team();
            team.setTeamName(teamName);
            teamRepository.save(team);
            return true;
        }catch (Exception e){
            System.out.println("팀 생성 중 문제 발생");
            e.printStackTrace();
            return false;
        }
    }

    //팀 정보 수정
    public void updateTeam(TeamDto teamDto){
        Team team = teamRepository.findById(teamDto.getTeamId()).orElseThrow(()-> new IllegalArgumentException("팀 없음"));

        team.setTeamName(teamDto.getTeamName());
        teamRepository.save(team);
    }

    //postion add
    public boolean createPosition(String positionName){
        try {
            boolean positionExist = positionRepository.existsByPositionName(positionName);
            if (positionExist) {
                System.out.println("같은 직책 이름 존재합니다.");
                return false;
            }
            Position position = new Position();
            position.setPositionName(positionName);
            positionRepository.save(position);
            return true;
        }catch (Exception e){
            System.out.println("직책 생성 중 문제 발생");
            e.printStackTrace();
            return false;
        }
    }

    //직책 정보 수정
    public void updatePosition(PositionDto positionDto){
        Position position = positionRepository.findById(positionDto.getPositionId()).orElseThrow(()-> new IllegalArgumentException("직책 없음"));

        position.setPositionName(positionDto.getPositionName());
        positionRepository.save(position);
    }

    //user -> userResponseDto
    public UserResponseDto toUserResponseDto(User user){
        UserResponseDto userResponseDto = new UserResponseDto();
        userResponseDto.setTeamId(user.getTeam().getTeamId());
        userResponseDto.setTeamName(user.getTeam().getTeamName());
        userResponseDto.setPositionId(user.getPosition().getPositionId());
        userResponseDto.setPositionName(user.getPosition().getPositionName());
        userResponseDto.setUserId(user.getUserId());
        userResponseDto.setEmail(user.getEmail());
        userResponseDto.setName(user.getName());
        userResponseDto.setRole(user.getRole());
        userResponseDto.setStatus(user.getStatus());
        return userResponseDto;
    }

    //userRequestDto ->user
    public User RequestToUser(UserRequestDto userRequestDto){
        Team team = teamRepository.findById(userRequestDto.getTeamId()).orElseThrow(() -> new IllegalArgumentException("팀 찾기 실패"));
        Position position = positionRepository.findById(userRequestDto.getPositionId()).orElseThrow(() -> new IllegalArgumentException("직책찾기 실패"));
        User user = new User();
        user.setUserId(userRequestDto.getUserId());
        user.setEmail(userRequestDto.getEmail());
        user.setStatus(userRequestDto.getStatus());
        user.setRole(userRequestDto.getRole());
        user.setName(userRequestDto.getName());
        user.setPassword(passwordEncoder.encode(userRequestDto.getPassword()));
        user.setTeam(team);
        user.setPosition(position);

        return user;
    }

    //list user - > list userDto
    public List<UserResponseDto> userDtoList(){
        List<User> users = userRepository.findAll();
        List<UserResponseDto> userDtoList = new ArrayList<>();
        for(User user: users){
            UserResponseDto userDto = new UserResponseDto();
            userDto.setTeamId(user.getTeam().getTeamId());
            userDto.setTeamName(user.getTeam().getTeamName());
            userDto.setPositionId(user.getPosition().getPositionId());
            userDto.setPositionName(user.getPosition().getPositionName());
            userDto.setUserId(user.getUserId());
            userDto.setEmail(user.getEmail());
            userDto.setName(user.getName());
            userDto.setRole(user.getRole());
            userDto.setStatus(user.getStatus());

            userDtoList.add(userDto);
        }
        return userDtoList;
    }

}
