package com.workflow.controller;

import com.workflow.DTO.request.DocumentRequest;
import com.workflow.DTO.response.DocumentResponse;
import com.workflow.DTO.response.MyApprovalListResponse;
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

    //서류 수정
    @PostMapping("/update")
    public  ResponseEntity<String> saveDocument(@RequestBody DocumentResponse response, @AuthenticationPrincipal User user){
        System.out.println("수정"+ response);
        try {
            //유저 한번 더 확인
            if(!user.getUserId().equals(response.getWriter().getId())){
                System.out.println("유저가 다릅니다.");
                return ResponseEntity.badRequest().body("유저가 다릅니다.");
            }
            documentService.updateDocument(response);
            System.out.println("문서 수정 완료");
            return ResponseEntity.ok("ok");

        }catch (Exception e) {
            System.out.println("수정 실패");
            e.printStackTrace();
            return ResponseEntity.badRequest().body("수정 실패");
        }
    }

    //문서 리스트
    @GetMapping("/list")
    public List<DocumentResponse> list( @RequestParam(required = false) String status, @AuthenticationPrincipal User user) {
        //내가 쓴 문서 다 가져옴
        if (status == null || status.equals("")) {
            List<DocumentResponse> docs = documentService.getAllList(user.getUserId());
            System.out.println("문서 리스트 다ㅏ" + docs);
            return docs;
        } else {
            List<DocumentResponse> docs = documentService.getAllList(user.getUserId());
            System.out.println("문서 리스트" + docs);
            return docs;
        }
    }

    //해당 문서 정보 가져오기
    @GetMapping("/detail/{docId}")
    public DocumentRequest docDetail(@PathVariable Long docId) {
        DocumentRequest docs = documentService.getDocDetail(docId);
        System.out.println("문서 리스트 다ㅏ" + docs);
        return docs;
    }

    //서류 제출
    @PostMapping("/submit/{docId}")
    public ResponseEntity<String> submitMydoc(@PathVariable Long docId){
        //승인하는 사람 1의 status를 pending으로 서류 in Progress로 업데이트해야함
        try {
            documentService.submitMydoc(docId);
            System.out.println("다음 사람 상태 변경 완료");
            return ResponseEntity.ok("상태변경성공");
        }catch (Exception e){
            System.out.println("t상태변경 실패");
            e.printStackTrace();
            return ResponseEntity.badRequest().body("상태변경 실페");
        }
    }

    @GetMapping("/myApprovalList")
    public ResponseEntity<MyApprovalListResponse> myApprovalList(@AuthenticationPrincipal User user){
        //userid가 나 의 approval status가 pending인거
        MyApprovalListResponse list = documentService.MyApprovalList(user.getUserId());

    }



}
