import React, { createContext, useState, useEffect,useContext } from "react";
import { useChatListSocket } from "../hooks/useChatListSocket";
import api from '../api/api'
import {showChatToast} from './showChatToast'


const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [userId, setUserId] = useState(localStorage.getItem("userId"));
    const [rooms, setRooms] = useState([]);
    const [currentRoomId, setCurrentRoomId] = useState(null); // 현재 보고 있는 방
    const [messages, setMessages] = useState({});

    useEffect(() => {
        if(!userId) return;
        api.get(`/chat/list?userId=${userId}`)
            .then(res => setRooms(res.data))
            .catch(() => console.error('채팅 리스트 가져오기 실패'));
    }, [userId]);
    
  // 방 구독 + 메시지 수신
  useChatListSocket(rooms, (roomId, message) => {
    setMessages(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), message],
    }));
    
    if(message.senderId !== Number(userId)){
      showChatToast(message);
    }

    setRooms(prevRooms => {
      const updatedRooms = prevRooms.map(room =>
        room.id === roomId
          ? {
              ...room,
              content: message.content,
              time: message.time || new Date().toISOString(),
              unReadMessage: room.id === currentRoomId ? 0 : (room.unReadMessage || 0) + 1,
            }
          : room
      );

      // 해당 room만 앞으로 이동
      const targetRoom = updatedRooms.find(r => r.id === roomId);
      const otherRooms = updatedRooms.filter(r => r.id !== roomId);
      return [targetRoom, ...otherRooms];
    });
    
  });

  const totalUnread = rooms.reduce((sum, room) => sum + (room.unReadMessage || 0), 0);

  return (
    <ChatContext.Provider value={{ rooms, setRooms, currentRoomId, setCurrentRoomId, messages, totalUnread  }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};