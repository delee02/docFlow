import { useEffect, useState, useRef } from "react";
import api from "../../api/api";
import './ChatRoom.css';

export default function ChatRoom({ roomId, roomName, _userId }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const userId = Number(_userId);
  useEffect(() => {
    api.get(`chat/room/${roomId}`)
    .then(res => {
      setMessages(res.data);
    }).catch(() => console.error("채팅방 정보갖뎌오기 실패"));
  }, [roomId]);

console.log(messages , "가져온 메세지")

  useEffect(()=> {
    messagesEndRef.current?.scrollIntoView({beghavior: "smooth"});
  }, [messages]); 

    const sendMessage = async() => {
      if(!inputValue.trim()) return;
      setMessages([...messages, {createdAt: new Date().toISOString() , senderId: userId, type:"NORMAL", content:inputValue}]);
      setInputValue("");
      
      try{
        await api.post('chat/newMessage',{
          roomId : Number(roomId),
          senderId : Number(userId),
          content: inputValue,
          type: 'NORMAL',
          createdAt: new Date().toISOString() 
        });
      }catch(err){
        console.error(err);
        alert("새 채팅 추가 실패");
      }
      
    };
  
  return (
    <div className="chat-room-container">
      <div className="chat-header">{roomName}</div>
      <div className="chat-messages">
        {messages.map(msg => {
          if (msg.type === "SYSTEM") {
            return <div key={msg.id} className="message system-message">{msg.content}</div>;
          }
          const isMine = msg.senderId === userId
          console.log("ㅇㅈ", userId, " 샌더", msg.senderId)
          return (
            <div key={msg.id} className={`message normal-message ${isMine ? "mine" : "other"}`}>
              <div className="message-bubble">{msg.content}</div>
              <p>{msg.createdAt}</p>
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
