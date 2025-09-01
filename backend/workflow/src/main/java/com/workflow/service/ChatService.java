package com.workflow.service;

import com.workflow.DTO.request.ChatMessageRequest;
import com.workflow.DTO.request.NewChatRequest;
import com.workflow.DTO.response.ChatMessageResponse;
import com.workflow.DTO.response.ChatRoomListResponse;
import com.workflow.DTO.response.ChatRoomResponse;
import com.workflow.DTO.response.NewChatResponse;
import com.workflow.constants.ROOMTYPE;
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
import java.util.Optional;

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

    //새로운 메세지 추가
    public void newMessage(ChatMessageRequest message) {
        ChatRoom chatRoom = chatRepository.findById(message.getRoomId()).orElseThrow(() -> new IllegalArgumentException("요효하지 않은 메세지"));
        ChatMessage newMsg = new ChatMessage();
        newMsg.setRoom(chatRoom);
        newMsg.setSenderId(message.getSenderId());
        newMsg.setContent(message.getContent());
        newMsg.setType(message.getType());
        newMsg.setCreatedAt(message.getCreatedAt());
        chatMessageRepository.save(newMsg);
    }

    //새로운 채팅방 추가
    public NewChatResponse newChat(NewChatRequest newChatRequest, Long userId) {
        Long u1 = Math.min(newChatRequest.getUserIds().get(0), newChatRequest.getUserIds().get(1));
        Long u2 = Math.max(newChatRequest.getUserIds().get(0), newChatRequest.getUserIds().get(1));
        String dmKey = u1+ ":" + u2;
        //만약 이미 채팅방이 있는 사람 선택하면 (DIRECT만)
        if(newChatRequest.getType().equals(ROOMTYPE.DIRECT)){
            Optional<ChatRoom> exist = chatRepository.findByDmKey(dmKey);
            if (exist.isPresent()) {
                NewChatResponse chatResponse = new NewChatResponse();
                chatResponse.setId(exist.get().getId());
                chatResponse.setName(exist.get().getName());
                chatResponse.setType(exist.get().getType());
                return chatResponse;
            }
        }

        //chat_room 에 insert 하고
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setName(newChatRequest.getName());
        chatRoom.setType(newChatRequest.getType());
        chatRoom.setCreatedAt(LocalDateTime.now());
        chatRoom.setCreatedBy(userId);
        chatRoom.setDmKey(dmKey);

        //chat_romm member에 insert
        List<ChatRoomMember> members = new ArrayList<>();
        for(Long user : newChatRequest.getUserIds()){
            ChatRoomMember member = new ChatRoomMember();
            member.setRoom(chatRoom);
            member.setJoinedAt(LocalDateTime.now());
            member.setUserId(user);
            members.add(member);
        }
        chatRoom.setMembers(members);
        chatRepository.save(chatRoom);

        //새로운 채팅방이 만들어지면 바로 들어가는 데이터 넘겨주기 위해
        NewChatResponse newChatResponse = new NewChatResponse();
        newChatResponse.setId(chatRoom.getId());
        newChatResponse.setName(chatRoom.getName());
        newChatResponse.setType(chatRoom.getType());

        return newChatResponse;
    }

}
