package com.workflow.service;


import com.workflow.DTO.request.ChatMessageRequest;
import com.workflow.DTO.response.ChatRoomListResponse;
import com.workflow.DTO.response.ChatMessageResponse;
import com.workflow.entity.ChatMessage;
import com.workflow.entity.ChatRoom;
import com.workflow.entity.ChatRoomMember;
import com.workflow.repository.ChatMessageRepository;

import com.workflow.repository.ChatRepository;
import com.workflow.repository.ChatRoomMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatService {
    private final ChatRepository chatRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final ChatMessageRepository chatMessageRepository;


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

    public List<ChatMessageResponse> getChat(Long roomId) {
        List<ChatMessage> chatList = chatMessageRepository.findAllByRoom_Id(roomId);
        List<ChatMessageResponse> chats = new ArrayList<>();
        for(ChatMessage chat : chatList){
            ChatMessageResponse msg = new ChatMessageResponse();
            msg.setId(chat.getId());
            msg.setRoomId(chat.getRoom().getId());
            msg.setSenderId(chat.getSenderId());
            msg.setContent(chat.getContent());
            msg.setType(chat.getType());
            msg.setCreatedAt(chat.getCreatedAt());
            chats.add(msg);
        }
        return chats;
    }

    //새로운 채팅 추가
    public void newMessage(ChatMessageRequest message) {
        ChatRoom chatRoom = chatRepository.findById(message.getRoomId()).orElseThrow(() -> new IllegalArgumentException("요효하지 않은 채팅방"));
        ChatMessage newMsg = new ChatMessage();
        newMsg.setRoom(chatRoom);
        newMsg.setSenderId(message.getSenderId());
        newMsg.setContent(message.getContent());
        newMsg.setType(message.getType());
        newMsg.setCreatedAt(message.getCreatedAt());
        chatMessageRepository.save(newMsg);
    }

}
