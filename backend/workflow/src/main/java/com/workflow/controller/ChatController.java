package com.workflow.controller;

import com.workflow.DTO.request.ChatMessageRequest;

import com.workflow.DTO.request.NewChatRequest;
import com.workflow.DTO.response.ChatMessageResponse;
import com.workflow.DTO.response.ChatRoomListResponse;
import com.workflow.DTO.response.ChatRoomResponse;
import com.workflow.DTO.response.NewChatResponse;

import com.workflow.entity.ChatMessage;
import com.workflow.entity.ChatRoomMember;
import com.workflow.entity.User;
import com.workflow.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    //새로운 채팅방 추가하기
    @PostMapping("/newChat")
    public ResponseEntity<NewChatResponse> newChat(@RequestBody NewChatRequest newChatRequest, @AuthenticationPrincipal User user){
        System.out.println("유저 잘ㄷ나오가"+user.getUserId());
        try {
            NewChatResponse response = chatService.newChat(newChatRequest, user.getUserId());
            return ResponseEntity.ok(response);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    //채팅방 리스트 가져오기
    @GetMapping("/list")
    public ResponseEntity<List<ChatRoomListResponse>> chatList(@RequestParam Long userId){
        try{
            return ResponseEntity.ok(chatService.getChatList(userId));
        }catch (Exception e) {
            System.out.println("채팅목록 불러오기 실패");
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }



    //특정 채팅방 메세지 가져오기
    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<ChatMessageResponse>> chatMessages(@PathVariable Long roomId, @AuthenticationPrincipal User user){
        try {
            List<ChatMessageResponse> messages = chatService.getChat(roomId ,user.getUserId());
            return ResponseEntity.ok(messages);

        }catch (Exception e) {
            System.out.println("채팅방 정보들 가져오기 실페");
            return ResponseEntity.badRequest().body(null);
        }
    }

    //새로운 메세지 db추가
    @PostMapping("/newMessage")
    public ResponseEntity<String> newMessage(@RequestBody ChatMessageRequest message){
        try {
            System.out.println("가져온 메세지정보" + message);
            chatService.newMessage(message);

            return ResponseEntity.ok("새로운 채팅메세지 추가 성공");
        }catch (Exception e){
            System.out.println("새로운 채팅메세지 ㅊ추가 실패");
            e.printStackTrace();
            return ResponseEntity.badRequest().body("메세지추가 실패");
        }
    }

}
