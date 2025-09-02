import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// 훅에서 Client를 Ref로 유지해서 재사용 가능
export const useChatSocket = (roomId, onMessageReceived) => {
  const clientRef = useRef(null);

  useEffect(() => {
    // 한 번만 연결
    if (!clientRef.current) {
      const socket = new SockJS("http://localhost:8080/ws-chat");
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        connectHeaders: {
          Authorization: "Bearer " + localStorage.getItem("token"), // ✅ JWT 전달
        }
      });

      client.onConnect = () => {
        console.log("WebSocket connected");
        client.subscribe(`/topic/room/${roomId}`, (msg) => {
          const message = JSON.parse(msg.body);
          onMessageReceived(message);
        });
      };

      client.activate();
      clientRef.current = client;
    }

    return () => {
      if (clientRef.current) clientRef.current.deactivate();
    };
  }, [roomId, onMessageReceived]);

  // sendMessage 함수를 훅 안에서 재사용
  const sendMessageWebsocket = (content, sender) => {
    if (!clientRef.current || !clientRef.current.connected) return;

    const message = {
      roomId,
      sender,
      content,
      createdAt: new Date().toISOString(),
    };

    clientRef.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(message),
    });
  };

  return { sendMessageWebsocket };
};
