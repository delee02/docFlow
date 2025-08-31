package com.workflow.repository;

import com.workflow.entity.ChatRoom;
import com.workflow.entity.ChatRoomMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, Long> {
    List<ChatRoomMember> findAllByUserId(Long userId);
}
