package com.workflow.repository;

import com.workflow.DTO.response.ChatMessageResponse;
import com.workflow.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findAllByRoom_Id(Long roomId);

    //채팅방 최근 메세지 가져오기
    @Query("SELECT m FROM ChatMessage m " +
            "WHERE m.room.id IN :roomIds " +
            "AND m.createdAt = (SELECT MAX(m2.createdAt) FROM ChatMessage m2 WHERE m2.room.id = m.room.id)")
    List<ChatMessage> findLastMessagesByRoomIds(@Param("roomIds") List<Long> roomIds);

    @Query("""
        SELECT new com.workflow.DTO.response.ChatMessageResponse(
            m.id, m.room.id, m.senderId, u.name, m.content, m.type, m.createdAt
        )
        FROM ChatMessage m
        JOIN User u ON m.senderId = u.userId
        WHERE m.room.id = :roomId
        ORDER BY m.createdAt ASC
    """)
    List<ChatMessageResponse> findAllWithSenderNameByRoomId(@Param("roomId") Long roomId);
}

