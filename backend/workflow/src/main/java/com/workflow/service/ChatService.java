package com.workflow.service;

import com.workflow.DTO.response.ChatRoomListResponse;
import com.workflow.DTO.response.ChatRoomResponse;
import com.workflow.entity.ChatMessage;
import com.workflow.entity.ChatRoom;
import com.workflow.entity.ChatRoomMember;
import com.workflow.repository.ChatRepository;
import com.workflow.repository.ChatRoomMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatService {
    private final ChatRepository chatRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;

    public List<ChatRoomListResponse> getChatList(Long userId){
        List<ChatRoomMember> chatRoomList = chatRoomMemberRepository.findAllByUserId(userId);
        List<ChatRoomListResponse> list = new ArrayList<>();
        for(ChatRoomMember member : chatRoomList){
            ChatRoomListResponse room = new ChatRoomListResponse();
            room.setId(member.getRoom().getId());
            room.setName(member.getRoom().getName());
            list.add(room);
        }
        return list;
    }

    public List<ChatMessage> getChat(Long roomId) {
        List<ChatMessage> messages = ch

    }
}
