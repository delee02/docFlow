import React, {useEffect, useState, useRef} from "react";
import api from '../../api/api';
import ChatRoom from "./ChatRoom";
import './ChatSidebar.css';

export default function ChatSidebar(){
    const [open, setOpen] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect (() => {
    if(!open) return;
    api.get(`/chat/list?userId=${userId}`)
    .then(res => setRooms(res.data))
    .catch(()=> { console.error('채팅 리스트 가져오기 시실패')});

    }, [open, userId]);

    return (
    <>
      {/* 채팅 토글 버튼 */}
      <button className="chat-toggle-btn" onClick={() => setOpen(!open)}>
        {open ? '×' : '💬'}
      </button>

      {/* 슬라이드 패널 */}
      <div className={`chat-sidebar ${open ? 'open' : ''}`}>
        {!selectedRoom ? (
          <div className="chat-room-list">
            <h3>채팅방 목록</h3>
            {rooms.map(room => (
              <div
                key={room.id}
                className="chat-room-item"
                onClick={() => setSelectedRoom(room)}
              >
                {room.name}
              </div>
            ))}
          </div>
        ) : (
          <>
            <button className="back-btn" onClick={() => setSelectedRoom(null)}>← 목록</button>
            <ChatRoom roomId={selectedRoom.id} roomName={selectedRoom.name} _userId={userId} />
          </>
        )}
      </div>
    </>
  );


}