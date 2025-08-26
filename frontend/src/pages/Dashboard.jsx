import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardCards from '../components/DashboardCards';
import SignatureModal from "./signature/SignatureRegister";
import api from '../api/api'

const Dashboard = () => {
  const [showModal, setShowModal] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    ongoingDocs: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    async function fetchStats(){
      // TODO: API 호출해서 stats 데이터 받아오기
      // 예시 하드코딩
      setStats({
        totalUsers: 150,
        ongoingDocs: 12,
        pendingApprovals: 4,
      });
    }
    fetchStats();
    }, []);
  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.mainContent}>
        
        <h2>대시보드</h2>
        <DashboardCards stats={stats} />
        {/* 여기에 최근 생성된 결재 문서 목록 등 추가 가능 */}
        <h2>여기는 어디민이 아닙니다요</h2>
      </main>
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
