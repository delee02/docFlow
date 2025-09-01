import React, {useEffect, useState} from "react";
import api from '../../api/api';
import ChatRoom from "./ChatRoom";
import './ChatSidebar.css';
import SearchModal from './SearchModal'

const CreateChatModal = ({ onClose, onSelect }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>새 채팅 만들기</h2>
        <div className="modal-buttons">
          <button onClick={() => {onSelect("DIRECT"); onClose();}} className="btn dm-btn">
            Direct Message
          </button>
          <button onClick={() => {onSelect("GROUP"); onClose();}} className="btn group-btn">
            Group Chat
          </button>
        </div>
        <button onClick={onClose} className="close-btn">닫기</button>
      </div>
    </div>
  );
};

export default function ChatSidebar(){
    const [open, setOpen] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [openRooms, setOpenRooms] = useState([]); // 열린 ChatRoom 배열
    const [newChatModal, setNewChatModal] = useState(null);
    const [type, setType] = useState('');
    const userId = localStorage.getItem('userId');

    useEffect (() => {
      if(!open) return;
      api.get(`/chat/list?userId=${userId}`)
      .then(res => setRooms(res.data))
      .catch(()=> { console.error('채팅 리스트 가져오기 실패')});
    }, [open, userId]);

    const handleNewChat = async ({ type, users, name }) => {
      try{
        const allUsers = Array.from(new Set([...users, userId]));
        const res = await api.post('chat/newChat', {
          type : type,
          userIds : allUsers,
          name : name,
        });
        const newChat = res.data;
        setRooms((prev) => [...prev, newChat]);
        setOpenRooms(prev => [...prev, newChat]);
      }catch (err){
        console.error("채팅방 추가 실패", err);
      }
    }

    const openChatRoom = (room) => {
      if(!openRooms.find(r => r.id === room.id)){
        setOpenRooms(prev => [...prev, room]);
      }
    }

    const closeChatRoom = (roomId) => {
      setOpenRooms(prev => prev.filter(r => r.id !== roomId));
    }

    return (
      <>
        {/* 채팅 토글 버튼 */}
        <button className="chat-toggle-btn" onClick={() => setOpen(!open)}>
          {open ? '×' : '💬'}
        </button>

        {/* Sidebar */}
        <div className={`chat-sidebar ${open ? 'open' : ''}`}>
          <div className="chat-room-list">
            <div className="chat-room-header">
              <h3>채팅방 목록</h3>
              <button className="open-btn" onClick={() => setNewChatModal("newChat")}>
                새로운 채팅
              </button>
            </div>

            {newChatModal === "newChat" && (
              <CreateChatModal onClose={() => setNewChatModal(null)} onSelect={setType}/>  
            )}
            {type !== "" && (
              <SearchModal type={type} onClose={() => setType("")} handleNewChat={handleNewChat}/>
            )}

            <div className="chat-list">
              {rooms.map((room) => (
                <div key={room.id} className="chat-room-item" onClick={() => openChatRoom(room)}>
                  {room.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ChatRoom 여러 개 모달 */}
        {openRooms.map((room, index) => (
          <div
            key={room.id}
            className="chatroom-modal-backdrop"
            style={{ right: `${index * 420 + 10}px` }}
          >
            <div className="chatroom-modal-content">
              <button className="chatroom-close-btn" onClick={() => closeChatRoom(room.id)}>×</button>
              <ChatRoom roomId={room.id} roomName={room.name} _userId={userId} />
            </div>
          </div>
        ))}
      </>
    );
}
