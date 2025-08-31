package com.workflow.controller;

import com.workflow.DTO.response.ChatRoomListResponse;
import com.workflow.DTO.response.ChatRoomResponse;
import com.workflow.entity.ChatMessage;
import com.workflow.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    //특정 채팅방 정보랑 메세지 가져오기
    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<ChatMessage>> chatMessages(@RequestParam Long roomId){
        try {
            List<ChatMessage> messages = chatService.getChat(roomId);

        }catch (Exception e) {
            System.out.println("채팅방 정보들 가져오기 실페");
            return ResponseEntity.badRequest().body(null);
        }
    }
}
