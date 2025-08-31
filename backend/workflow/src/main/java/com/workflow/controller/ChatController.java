package com.workflow.controller;

import com.workflow.DTO.request.ChatMessageRequest;
import com.workflow.DTO.response.ChatMessageResponse;
import com.workflow.DTO.response.ChatRoomListResponse;

import com.workflow.entity.ChatMessage;
import com.workflow.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    //채팅방 리스트 가져오기
    @GetMapping("/list")
    public ResponseEntity<List<ChatRoomListResponse>> chatList(@RequestParam Long userId){
        try{
            return ResponseEntity.ok(chatService.getChatList(userId));
        }catch (Exception e) {
            System.out.println("채팅목록 불러오기 실패");
            return ResponseEntity.badRequest().body(null);
        }
    }

    //특정 채팅방 메세지 가져오기
    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<ChatMessageResponse>> chatMessages(@PathVariable Long roomId){
        try {
            List<ChatMessageResponse> messages = chatService.getChat(roomId);
            return ResponseEntity.ok(messages);

        }catch (Exception e) {
            System.out.println("채팅방 정보들 가져오기 실페");
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/newMessage")
    public ResponseEntity<String> newMessage(@RequestBody ChatMessageRequest message){
        try {
            System.out.println("가져온 메세지정보" + message);
            chatService.newMessage(message);

            return ResponseEntity.ok("새로운 채팅메세지 추가 성공");
        }catch (Exception e){
            System.out.println("새로운 채팅메세지 ㅊ추가 실패");
            return ResponseEntity.badRequest().body("메세지추가 실패");
        }
    }

}
