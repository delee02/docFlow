package com.workflow.controller;

import com.workflow.DTO.request.SignResponseDto;
import com.workflow.service.SignatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/signature")
@RequiredArgsConstructor
public class SignController {
    private final SignatureService signatureService;
    @PostMapping("/register")
    public ResponseEntity<String> registerSign(@RequestBody SignResponseDto signResponseDto){
        try {
            System.out.println("싸인유알엘드 얼오니?"+signResponseDto.getImgUrl());
            signatureService.registerSign(signResponseDto);
            return ResponseEntity.ok("싸인등록 성공");
        }catch (Exception e){
            System.out.println("싸인등록 실패");
            e.printStackTrace();
            return ResponseEntity.badRequest().body("싸인등록 실패");
        }
    }
}
