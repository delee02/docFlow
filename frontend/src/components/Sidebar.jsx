import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    alert('로그아웃 되었습니다.');
    navigate('/');
  }

  const role =localStorage.getItem('role');

  return (
    <nav style={styles.sidebar}>
      <h2 style={styles.title}>메뉴</h2>
      <ul style={styles.ul}>
         {(role === 'ROLE_ADMIN') && (
          <>
          <li><NavLink to="/admin/dashboard" style={styles.link} activeStyle={styles.active}>대시보드</NavLink></li>
          <li><NavLink to="/admin/team/list" style={styles.link} activeStyle={styles.active}>인사 관리</NavLink></li>
          <li><NavLink to="/admin/documents" style={styles.link} activeStyle={styles.active}>결재 문서 관리</NavLink></li>
          </>
        )}
        <li><NavLink to="/dashboard" style={styles.link} activeStyle={styles.active}>대시보드</NavLink></li>
        <li><NavLink to="/document/edit" style={styles.link} activeStyle={styles.active}>결재 문서 작성</NavLink></li>
      </ul>
      

      <div style={styles.logoutContainer}>
        <button onClick={handleLogout} style={styles.logoutButton}>로그아웃</button>
      </div>
    </nav>
  );
};

const styles = {
  sidebar: {
    width: '220px',
    height: '100vh',
    backgroundColor: '#007bff',
    color: 'white',
    padding: '20px',
    boxSizing: 'border-box',
  },
  title: {
    marginBottom: '30px',
  },
  ul: {
    listStyle: 'none',
    paddingLeft: 0,
  },
  link: {
    display: 'block',
    color: 'white',
    padding: '10px 0',
    textDecoration: 'none',
  },
  active: {
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  logoutContainer: {
    marginTop: 'auto',
  },
  logoutButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Sidebar;