package com.workflow.repository;

import com.workflow.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRepository extends JpaRepository<ChatRoom, Long> {
    //user1 과 user2로 만든 키로 direct 방 하나만 생성하기 위해 만듦
    Optional<ChatRoom> findByDmKey(String dmKey);
}
