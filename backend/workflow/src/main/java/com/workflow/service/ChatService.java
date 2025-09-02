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
import com.workflow.entity.User;
import com.workflow.repository.ChatMessageRepository;
import com.workflow.repository.ChatRepository;
import com.workflow.repository.ChatRoomMemberRepository;
import com.workflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatService {
    private final RedisTemplate redisTemplate;
    private final ChatRepository chatRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;


    public List<ChatRoomListResponse> getChatList(Long userId){
        List<ChatRoomMember> chatRoomList = chatRoomMemberRepository.findAllByUser_UserId(userId);

        List<Long> roomIds = chatRoomList.stream()
                .map(member  -> member.getRoom().getId())
                .collect(Collectors.toList());

        //마지막 메세지랑 시간 보여주기
        List<ChatMessage> lastMessages = chatMessageRepository.findLastMessagesByRoomIds(roomIds);

        List<ChatRoomListResponse> list = chatRoomList.stream().map(member -> {
            ChatRoomListResponse dto = new ChatRoomListResponse();
            Long roomId = member.getRoom().getId();
            dto.setId(roomId);

            //direct 일 때는 상대방 이름만, 단체는 모든 사람 이름 보이기
            if(member.getRoom().getType() ==ROOMTYPE.DIRECT){
                ChatRoomMember other = member.getRoom().getMembers().stream()
                        .filter(m -> !m.getUser().getUserId().equals(userId))
                        .findFirst()
                        .orElse(null);
                dto.setName(other != null ? other.getUser().getName() : "Unknown");
            }else {
                dto.setName(member.getRoom().getName());
            }

            // lastMessages에서 방별 마지막 메시지 찾기
            lastMessages.stream()
                    .filter(msg -> msg.getRoom().getId().equals(roomId))
                    .findFirst()
                    .ifPresent(msg -> {
                        dto.setContent(msg.getContent());
                        dto.setTime(msg.getCreatedAt());
                    });
            dto.setUnReadMessage(getUnreadCount(roomId, userId));

            return dto;
        }).collect(Collectors.toList());
        return list;
    }

    //채팅방 채팅 가져오기
    public List<ChatMessageResponse> getChat(Long roomId, Long userId) {
        List<ChatMessageResponse> chatList = chatMessageRepository.findAllWithSenderNameByRoomId(roomId);

        List<ChatMessageResponse> chats = new ArrayList<>();
        for(ChatMessageResponse chat : chatList){
            ChatMessageResponse msg = new ChatMessageResponse();
            msg.setId(chat.getId());
            msg.setRoomId(chat.getRoomId());
            msg.setSenderName(chat.getSenderName());
            msg.setSenderId(chat.getSenderId());
            msg.setContent(chat.getContent());
            msg.setType(chat.getType());
            msg.setCreatedAt(chat.getCreatedAt());
            chats.add(msg);
        }
        //안읽은 메세지 삭제
        resetUnread(roomId, userId);
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
        newMsg.setCreatedAt(Instant.now());
        chatMessageRepository.save(newMsg);

        //안읽음 redis 추가
        incrementUnread(message.getRoomId(), message.getSenderId());
    }

    //새로운 채팅방 추가
    public NewChatResponse newChat(NewChatRequest newChatRequest, Long userId) {
        String dmKey = null;
        //만약 이미 채팅방이 있는 사람 선택하면 (DIRECT만)
        if(newChatRequest.getType().equals(ROOMTYPE.DIRECT)){
            Long u1 = Math.min(newChatRequest.getUserIds().get(0), newChatRequest.getUserIds().get(1));
            Long u2 = Math.max(newChatRequest.getUserIds().get(0), newChatRequest.getUserIds().get(1));
            dmKey = u1+ ":" + u2;
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
        chatRoom.setCreatedAt(Instant.now());
        chatRoom.setCreatedBy(userId);
        chatRoom.setDmKey(dmKey);

        //chat_romm member에 insert
        List<ChatRoomMember> members = new ArrayList<>();
        for(Long user : newChatRequest.getUserIds()){
            User mem = userRepository.findByUserId(user).orElse(null);
            ChatRoomMember member = new ChatRoomMember();
            member.setRoom(chatRoom);
            member.setJoinedAt(LocalDateTime.now());
            member.setUser(mem);
            members.add(member);
        }
        chatRoom.setMembers(members);
        chatRepository.save(chatRoom);

        //새로운 채팅방이 만들어지면 바로 들어가는 데이터 넘겨주기 위해
        NewChatResponse newChatResponse = new NewChatResponse();
        newChatResponse.setId(chatRoom.getId());
        newChatResponse.setName(chatRoom.getName());
        newChatResponse.setType(chatRoom.getType());
        newChatResponse.setTime(chatRoom.getCreatedAt());

        return newChatResponse;
    }

    //안읽은 메세지 추가를 위해
    public void incrementUnread(Long roomId, Long senderId){
        List<ChatRoomMember> members = chatRoomMemberRepository.findAllByRoomId(roomId);
        for(ChatRoomMember member : members){
            //보낸 사람 말고 방에 있는 사람들 unreadCount+1해줌
            if(!member.getUser().getUserId().equals(senderId)){
                String key = "unread:"+roomId+":"+member.getUser().getUserId();
                Long unread = redisTemplate.opsForValue().increment(key);
                System.out.println("메세지 unread redis 저장:user "+member.getUser().getUserId()+"의 안읽은 메세지"+ unread);
            }
        }
    }

    //채팅방 입장 시 unread 초기화
    public void resetUnread(Long roomId, Long userId){
        String key = "unread:"+roomId+":"+userId;
        redisTemplate.delete(key);
    }

    //채팅 목록 불러올 때 unread 표시
    public int getUnreadCount(Long roomId, Long userId) {
        String key = "unread:" + roomId + ":" + userId;
        Object value = redisTemplate.opsForValue().get(key);
        if (value == null) {
            return 0; // 없으면 0 반환
        }
        if (value instanceof Integer) {
            return (Integer) value;
        }
        // 혹시 String으로 저장되어 있으면 파싱
        if (value instanceof String) {
            try {
                return Integer.parseInt((String) value);
            } catch (NumberFormatException e) {
                return 0;
            }
        }
        return 0;
    }

}
