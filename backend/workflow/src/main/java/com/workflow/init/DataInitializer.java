package com.workflow.init;

import com.workflow.constants.ROLE;
import com.workflow.constants.USERSTATUS;
import com.workflow.entity.User;
import com.workflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@company.com";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("1234")); // 초기 비밀번호
            admin.setName("관리자");
            admin.setRole(ROLE.ROLE_ADMIN);
            admin.setStatus(USERSTATUS.ACTIVE);
            // team, position 필요하면 기본값 세팅 or null 처리
            userRepository.save(admin);
            System.out.println("기본 관리자 계정 생성됨: " + adminEmail);
        }
    }
}

