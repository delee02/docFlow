import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardCards from '../components/DashboardCards';
import api from '../api/api'
import ChatSidebar from './chat/ChatSidebar';
import { useChatListSocket } from "../hooks/useChatListSocket";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const userId = localStorage.getItem('userId');
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    ongoingDocs: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    async function fetchStats(){
      setStats({
        ongoingDocs: 12,
        pendingApprovals: 4,
      });
    }
    fetchStats();
    }, []); 

    //방구독
    useChatListSocket(rooms, (roomId, message) => {
      console.log(roomId,"방 message=",message);
  });
  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.mainContent}>
        
        <h2>대시보드</h2>
        <DashboardCards stats={stats} />
        {/* 여기에 최근 생성된 결재 문서 목록 등 추가 가능 */}
        <h2>여기는 어디민이 아닙니다요</h2>
      </main>
      <ChatSidebar rooms = {rooms} setRooms={setRooms}/>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f8f9fa',
    backgroundColor: '',
    minHeight: '100vh',
  },
};

export default Dashboard;
