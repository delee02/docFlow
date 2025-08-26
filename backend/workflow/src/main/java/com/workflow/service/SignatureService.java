package com.workflow.service;

import com.workflow.DTO.request.SignResponseDto;
import com.workflow.entity.DocumentSign;
import com.workflow.entity.User;
import com.workflow.repository.SignatureRepository;
import com.workflow.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@AllArgsConstructor
public class SignatureService {
    private final SignatureRepository signatureRepository;
    private final UserRepository userRepository;
    public boolean haveSignature(Long userId) {
        DocumentSign sign = signatureRepository.findBySigner_UserId(userId).orElse(null);
        if(sign == null) return false;
        else return true;
    }

    public void registerSign(SignResponseDto signResponseDto) {
        User user = userRepository.findById(signResponseDto.getUserId()).orElseThrow(() -> new IllegalArgumentException("유저없음"));
        user.setSignImgUrl(signResponseDto.getImgUrl());
        userRepository.save(user);
    }
}
