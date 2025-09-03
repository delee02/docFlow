import React, { useEffect, useState, useContext  } from "react";
import api from '../../api/api';
import ChatRoom from "./ChatRoom";
import '../../css/ChatSidebar.css';
import SearchModal from './SearchModal';
import { useChat } from "../../components/ChatProvider";

const CreateChatModal = ({ onClose, onSelect }) => (
  <div className="modal-select">
    <div className="modal-select-content">
      <h2>새 채팅 만들기</h2>
      <div className="modal-select-buttons">
        <button onClick={() => {onSelect("DIRECT"); onClose();}} className="btn dm-btn">Direct Message</button>
        <button onClick={() => {onSelect("GROUP"); onClose();}} className="btn group-btn">Group Chat</button>
      </div>
      <button onClick={onClose} className="select-close-btn">x</button>
    </div>
  </div>
);

export default function ChatSidebar() {
  const { rooms, setRooms } = useChat();
  const [open, setOpen] = useState(false);
  const [openRooms, setOpenRooms] = useState([]);
  const [newChatModal, setNewChatModal] = useState(null);
  const [type, setType] = useState('');
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const { totalUnread } = useChat();

  const handleNewChat = async ({ type, users, name }) => {
    try {
      const allUsers = Array.from(new Set([...users, userId]));
      const res = await api.post('chat/newChat', { type, userIds: allUsers, name });
      setRooms(prev => [...prev, res.data]);
      setOpenRooms(prev => [...prev, res.data]);
    } catch (err) {
      console.error("채팅방 추가 실패", err);
    }
  };

  const openChatRoom = (room) => {
    if(!openRooms.find(r => r.id === room.id)) setOpenRooms(prev => [...prev, room]);
    setRooms(prev =>
    prev.map(r =>
      r.id === room.id
        ? { ...r, unReadMessage: 0 }
        : r
    )
  );
  setCurrentRoomId(room.id);
  }

  const closeChatRoom = (roomId) => {
    setOpenRooms(prev => prev.filter(r => r.id !== roomId));
    if (currentRoomId === roomId) setCurrentRoomId(null);
  }
  return (
    <>
    <button className="chat-toggle-btn" onClick={() => setOpen(!open)}>
        {open ? '×' : '💬'}
        
      </button>
      {/* 💬일 때만 뱃지 */}
      {!open && totalUnread > 0 && (
        <span className="total-unread-badge">{totalUnread}</span>
      )}

      
      <div className={`chat-sidebar ${open ? 'open' : ''}`}>
        <div className="chat-room-list">
          <div className="chat-room-header">
            <h3>채팅방 목록</h3>
            <button className="open-btn" onClick={() => setNewChatModal("newChat")}>새 채팅</button>
          </div>

          {newChatModal === "newChat" && (
            <CreateChatModal onClose={() => setNewChatModal(null)} onSelect={setType}/>
          )}

          {type !== "" && (
            <SearchModal type={type} onClose={() => setType("")} handleNewChat={handleNewChat}/>
          )}

          <div className="chat-list">
            {Array.isArray(rooms) && rooms
              .slice() // 원본 배열 건드리지 않기 위해 복사
              .sort((a, b) => new Date(b.time) - new Date(a.time)) // 최신 메시지 먼저
              .map(room => (
                <div key={room.id} className="chat-room-item" onClick={() => openChatRoom(room)}>
                  <div className="room-info">
                    <span className="room-name">{room.name}</span>
                    <span className="last-message">{room.content}</span>
                  </div>
                  <div className="room-right">
                  <span className="time">
                    {new Date(room.time || Date.now()).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        timeZone: "Asia/Seoul" 
                    })}
                  </span>
                  {room.unReadMessage > 0 && (
                    <span className="unread-badge">{room.unReadMessage}</span>
                  )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {openRooms.map((room, idx) => (
        <div key={room.id} className="chatroom-modal-backdrop" style={{ right: `${idx * 420 + 10}px` }}>
          <div className="chatroom-modal-content">
            <button className="chatroom-close-btn" onClick={() => closeChatRoom(room.id)}>×</button>
            <ChatRoom roomId={room.id} roomName={room.name} _userId={userId} _userName={userName} />
          </div>
        </div>
      ))}
    </>
  );
}