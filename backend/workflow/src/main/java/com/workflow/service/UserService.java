package com.workflow.service;

import com.workflow.DTO.request.UserListRequest;
import com.workflow.DTO.response.UserResponseDto;
import com.workflow.entity.User;
import com.workflow.mapper.UserMapper;
import com.workflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    //멘션에서 쓸 유저 가져가기
    public List<UserListRequest> getUsers(){
        List<User> users = userRepository.findAll();
        List<UserListRequest> mentions = new ArrayList<>();
        for(User user: users){
            UserListRequest mentionRequest = new UserListRequest();
            mentionRequest.setUserId(user.getUserId());
            mentionRequest.setName(user.getName());
            mentionRequest.setTeamName(user.getTeam().getTeamName());
            mentionRequest.setPositionName(user.getPosition().getPositionName());
            mentions.add(mentionRequest);
        }
        return mentions;
    }

    //내정보 가져오기
    public UserResponseDto getMe(String email){
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("유저 일치안함"));
        return UserResponseDto.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .teamId(user.getTeam().getTeamId())
                .teamName(user.getTeam().getTeamName())
                .role(user.getRole())
                .status(user.getStatus())
                .positionId(user.getPosition().getPositionId())
                .positionName(user.getPosition().getPositionName())
                .build();
    }
}
