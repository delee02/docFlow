package com.workflow.controller;

import com.workflow.DTO.request.DocumentRequest;
import com.workflow.DTO.response.UserResponseDto;
import com.workflow.entity.User;
import com.workflow.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
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
    private final DocumentService documentService;

    //redis 자동저장(새로고침이나 페이지 나갈 때 저장된다.)
    @PostMapping("/autoSave")
    public ResponseEntity<String> autoSave(@RequestBody Map<String, Object> body, @AuthenticationPrincipal User user){
        try {
            String key = "draft:" + user.getUserId();
            redisTemplate.opsForValue().set(key, body, Duration.ofDays(3));
            System.out.println("redis 저장 성공 key: "+key);
            return ResponseEntity.ok().build();
        }catch (Exception e){
            System.out.println("작성 중 문서 redis 저장 실패");
            return ResponseEntity.badRequest().body("저장 실패");
        }
    }

    //redis에 저장된 정보 가져가서 보여줌.
    @GetMapping("/autoSave")
    public ResponseEntity<?> autoSave(@AuthenticationPrincipal User user){
        try{
            String key = "draft:"+ user.getUserId();
            Object draft = redisTemplate.opsForValue().get(key);
            System.out.println("draft: "+ draft);

            if(draft == null) return ResponseEntity.noContent().build();// 없으면 204오류
            return ResponseEntity.ok(draft);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Draft 불러오기 실패");
        }
    }

    //db에 저장 이 때부터 document status는 IN_PROGRESS 가 된다.
    @PostMapping("/save")
    public  ResponseEntity<String> saveDocument(@RequestBody DocumentRequest request, @AuthenticationPrincipal User user){
        System.out.println("저장할게요"+ request);

        try {
            //유저 한번 더 확인
            if(!user.getUserId().equals(request.getWriter().getId())){
                System.out.println("유저가 다릅니다.");
                return ResponseEntity.badRequest().body("유저가 다릅니다.");
            }
            documentService.saveDocument(request);
            System.out.println("문서 저장 완료");
            return ResponseEntity.ok("ok");
        }catch (Exception e) {
            System.out.println("저장 실패");
            e.printStackTrace();
            return ResponseEntity.badRequest().body("저장 실퓨ㅐ");
        }
    }

    //문서 리스트
    @GetMapping("/list")
    public List<DocumentRequest> list( @RequestParam(required = false) String status) {
        if (status == null || status.equals("")) {
            List<DocumentRequest> docs = documentService.getAllList();
            System.out.println("문서 리스트" + docs);
            return docs;
        } else {
            List<DocumentRequest> docs = documentService.getAllList();
            System.out.println("문서 리스트" + docs);
            return docs;
        }
    }



}
