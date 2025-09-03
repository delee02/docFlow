import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const useChatListSocket = (rooms, onMessageReceived) => {
  const clientRef = useRef(null);

  useEffect(() => {
    if (!rooms || rooms.length === 0) return;



    // WebSocket 연결
    if (!clientRef.current) {
      const socket = new SockJS("http://localhost:8080/ws-chat");
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        connectHeaders: { Authorization: "Bearer " + localStorage.getItem("accessToken") },
      });

      

      client.onConnect = () => {
        console.log("WebSocket connected for all rooms");

        // 모든 방 구독
        rooms.forEach(room => {
          client.subscribe(`/topic/room/${room.id}`, (msg) => {
            const message = JSON.parse(msg.body);
            onMessageReceived(room.id, message);
          });
        });
      };

      client.onStompError = (frame) => console.error("STOMP ERROR", frame);
      client.onWebSocketError = (evt) => console.error("WebSocket ERROR", evt);
      client.onWebSocketClose = (evt) => console.warn("WebSocket closed", evt);

      client.activate();
      clientRef.current = client;
    }

    return () => {
      clientRef.current?.deactivate();
      clientRef.current = null;
    };
  }, [rooms, onMessageReceived]);

};
