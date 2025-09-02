import { Client } from "@stomp/stompjs";
import SockJS from 'sockjs-client';

export const sendMessage = (roomId, sender, content) => {
    const socket = new SockJS('http://localhost:8080/ws-chat');
    const client = new Client({ webSocketFactory: () => socket});

    client.onConnect = () => {
        client.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify({roomId, sender, content}),
        });
    };

    client.activate();
}