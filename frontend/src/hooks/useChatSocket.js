import { useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const useChatSocket = (roomId, onMessageReceived) => {
  const clientRef = useRef(null);

  // 안전하게 콜백을 최신 상태로 유지
  const messageCallback = useCallback(
    (msg) => {
      onMessageReceived(msg);
    },
    [onMessageReceived]
  );

  useEffect(() => {
    if (!roomId) return; // roomId 없으면 연결하지 않음

    if (!clientRef.current) {
      const socket = new SockJS("http://localhost:8080/ws-chat");
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        connectHeaders: { Authorization: "Bearer " + localStorage.getItem("accessToken") },
      });

      client.onConnect = () => {
        console.log("WebSocket connected for room:", roomId);
        client.subscribe(`/topic/room/${roomId}`, (msg) => {
          const message = JSON.parse(msg.body);
          messageCallback(message);
        });
      };

      client.onStompError = (frame) => {
        console.error("STOMP ERROR", frame);
      };

      client.onWebSocketError = (evt) => {
        console.error("WebSocket ERROR", evt);
      };

      client.onWebSocketClose = (evt) => {
        console.warn("WebSocket closed", evt);
      };

      client.activate();
      clientRef.current = client;
    }

  // cleanup에서만 끊기
    return () => {
      clientRef.current?.deactivate();
      clientRef.current = null;
    };
  }, [roomId]); // roomId가 바뀔 때만 연결 재시도


  const sendMessageWebsocket = useCallback((id ,content, sender, senderName) => {
    if (!clientRef.current || !clientRef.current.connected) return;

    const message = {
      id,
      roomId,
      senderId :sender,
      senderName : senderName,
      content,
      type: 'NORMAL',
      createdAt: new Date().toISOString(),
    };
    console.log("메세지", message)
    clientRef.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(message),
    });
  }, [roomId]);

  return { sendMessageWebsocket };
};
