package com.workflow.service;

import com.workflow.DTO.request.UserListRequest;
import com.workflow.DTO.response.UserResponseDto;
import com.workflow.entity.User;
import com.workflow.mapper.UserMapper;
import com.workflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private static final String USERLIST_KEY = "userList";

    //멘션이랑 수동 결재자 선택에서 쓸 유저 가져가기
    public List<UserListRequest> getUsers(){
        List<User> users = userRepository.findAll();
        List<UserListRequest> mentions = new ArrayList<>();
        if(!redisTemplate.hasKey(USERLIST_KEY)) {
            for (User user : users) {
                UserListRequest mentionRequest = new UserListRequest();
                mentionRequest.setUserId(user.getUserId());
                mentionRequest.setName(user.getName());
                mentionRequest.setTeamName(user.getTeam().getTeamName());
                mentionRequest.setPositionName(user.getPosition().getPositionName());
                mentions.add(mentionRequest);
            }
            //userList가 redis에 없으면 저장해준다.(유저 정보가 upgrage, new 등 )
            Boolean success = redisTemplate.opsForValue().setIfAbsent(USERLIST_KEY, mentions);
            System.out.println("Redis 저장 시도: key=" + USERLIST_KEY + ", 결과=" + success);
        }
        else {
            System.out.println("redis에 저장되어 있어 redis에서 userlist를 가져옵니다.");
            mentions =(List<UserListRequest>)redisTemplate.opsForValue().get(USERLIST_KEY);

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
