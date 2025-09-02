  import { useEffect, useState, useRef } from "react";
  import api from "../../api/api";
  import '../../css/ChatRoom.css';
  import { useChatSocket } from "../../hooks/useChatSocket";
  export default function ChatRoom({ roomId, roomName, _userId, currentRoomId}) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [unreadCount, setUnreadCount] = useState("");
    const messagesEndRef = useRef(null);
    const userId = Number(_userId);
    
    //websocket 연결
    const { sendMessageWebsocket } = useChatSocket(roomId, (msg) => {
      setMessages(prev => [...prev, msg]);

      if(roomId !== currentRoomId){
        setUnreadCount(prev => prev +1);
        alert(`새 메세지: ${msg.content}`);
      }
    });
    
    //채팅방 메세지랑 정보 가져오기
    useEffect(() => {
      api.get(`chat/room/${roomId}`)
        .then(res => setMessages(res.data))
        .catch(() => console.error("채팅방 정보 가져오기 실패"));
    }, [roomId]);

    //스크롤 맨 아래로
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    //메세지 전송
    const sendMessage = async () => {
      if (!inputValue.trim()) return;

      const newMsg = {
        id: Date.now(), // 임시 key
        createdAt: new Date().toISOString(),
        senderId: userId,
        type: "NORMAL",
        content: inputValue
      };

      setMessages([...messages, newMsg]);
      setInputValue("");

      try {
        await api.post('chat/newMessage', {
          roomId,
          senderId: userId,
          content: newMsg.content,
          type: newMsg.type,
        });

        //websocket 전송
        sendMessageWebsocket(newMsg.content, userId);
      } catch (err) {
        console.error(err);
        alert("메시지 전송 실패");
      }
    };

    return (
      <div className="chat-room-container">
        <div className="chat-header">{roomName}</div>

        <div className="chat-messages">
          {messages.map((msg, index) => {
            if (msg.type === "SYSTEM") {
              return (
                <div key={msg.id} className="message system-message">
                  {msg.content}
                </div>
              );
            }

            const isMine = msg.senderId === userId;
            const prevMsg = messages[index - 1];
            const showName = !isMine && (!prevMsg || prevMsg.senderId !== msg.senderId);

            return (
              <div key={msg.id} className={`message normal-message ${isMine ? "mine" : "other"}`}>
                {showName && <div className="message-header"><span className="sender-name">{msg.senderName}</span></div>}
                <div className="message-bubble">{msg.content}</div>
                <span className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' , timeZone: "Asia/Seoul"})}
                </span>
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
