package com.workflow.controller;

import com.workflow.DTO.request.ChatMessageRequest;
import com.workflow.DTO.request.ToastRequest;
import com.workflow.DTO.response.ChatMessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebsocketController {
    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatMessageResponse message){
        System.out.println("들어오시긴하는지 웹소켓아");
        simpMessagingTemplate.convertAndSend("/topic/room/" + message.getRoomId(), message);
    }
}
