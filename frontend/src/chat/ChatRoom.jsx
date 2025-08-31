import { useEffect, useState, useRef } from "react";
import api from "../api/api";
import './ChatRoom.css';

export default function ChatRoom({ roomId, userId }) {
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    api.get(`chat/room/${roomId}`)
    .then(res => {
      setRoom(res.data);
      setMessages(res.data.messages);
    }).catch(() => console.error("채팅방 정보갖뎌오기 실패"));
  }, [roomId]);

  useEffect(()=> {
    messagesEndRef.current?.scrollIntoView({beghavior: "smooth"});
  }, [messages]);

  const sendMessage = () => {
    if(!inputValue.trim()) return;
    setMessages([...messages, {id: Date.now(), senderId: userId, type:"NORMAL", content:inputValue}]);
    setInputValue("");
  };
  
  return (
    <div className="chat-room-container">
      <div className="chat-header">{room.name}</div>
      <div className="chat-messages">
        {messages.map(msg => {
          if (msg.type === "SYSTEM") {
            return <div key={msg.id} className="message system-message">{msg.content}</div>;
          }
          const isMine = msg.senderId === userId;
          return (
            <div key={msg.id} className={`message normal-message ${isMine ? "mine" : "other"}`}>
              <div className="message-bubble">{msg.content}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="메시지 입력..."
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
}
