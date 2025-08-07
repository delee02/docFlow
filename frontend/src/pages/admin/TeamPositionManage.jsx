import React, { useState } from "react";
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import TeamList from "./TeamList";
import PositionList from "./PositionList"
import UserList from "./UserList"


const TeamPositionManage = () =>{
    const [activeTab, setActiveTab] = useState('user');

    return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.mainContent}>
        <h2 style={styles.pageTitle}>인사 관리</h2>

        {/* 탭 메뉴 */}
        <div style={styles.tabMenu}>
            <button
            onClick={() => setActiveTab('user')}
            style={{
                ...styles.tabButton,
                ...(activeTab === 'user' ? styles.activeTabButton : {}),
            }}
          >
            사원 관리
          </button>
          <button
            onClick={() => setActiveTab('team')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'team' ? styles.activeTabButton : {}),
            }}
          >
            팀 관리
          </button>
          <button
            onClick={() => setActiveTab('position')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'position' ? styles.activeTabButton : {}),
            }}
          >
            직책 관리
          </button>
        </div>

        {/* 탭 내용 */}
        <div>
          {activeTab === 'user' && <UserList />}
          {activeTab === 'team' && <TeamList />}
          {activeTab === 'position' && <PositionList />}
        </div>
      </main>
    </div>
  );
}
const styles = {
    container: {
        display: 'flex',
    },
    mainContent: {
        flex: 1,
        padding: '30px',
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
    },
    pageTitle: {
        marginBottom: '20px',
        fontSize: '24px',
    },
    tabMenu: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',   
        borderBottom: '2px solid #ddd',
    },
    tabButton: {
        padding: '10px 20px',
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: '3px solid transparent',
        cursor: 'pointer',
        fontSize: '16px',
        color: '#555',
    },
    activeTabButton: {
        fontWeight: 'bold',
        borderBottom: '3px solid #1890ff',
        color: '#1890ff',
    },
};

export default TeamPositionManage;