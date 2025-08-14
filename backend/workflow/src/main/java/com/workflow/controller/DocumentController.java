package com.workflow.controller;

import com.workflow.DTO.response.UserResponseDto;
import com.workflow.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/document")
public class DocumentController {
    private final RedisTemplate<String, Object> redisTemplate;

    @PostMapping("/autoSave")
    public ResponseEntity<String> autoSave(@RequestBody Map<String, Object> body, @AuthenticationPrincipal User user){
        try {
            String key = "draft" + user.getUserId();
            redisTemplate.opsForValue().set(key, body, Duration.ofDays(3));
            System.out.println("redis 저장 성공 key: "+key);
            return ResponseEntity.ok().build();
        }catch (Exception e){
            System.out.println("작성 중 문서 redis 저장 실패");
            return ResponseEntity.badRequest().body("저장 실패");
        }
    }


}
