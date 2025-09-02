import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/user/list')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, []);

  const getRoleLabel = role => {
    switch (role){
      case 'ROLE_ADMIN' : return '관리자';
      case 'ROLE_MANAGER' : return '매니저';
      case 'ROLE_USER' : return '유저';
      default : return role;
    }
  }

  const handleAddUser = () => {
    navigate('/admin/user/form'); 
  };

  const handleEditUser = (userId) => {
    navigate(`/admin/user/form/${userId}`);
  }

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>에러 발생: {error.message}</p>;

  return (
    <div style={styles.container}>
      <main style={styles.mainContent}>
        <div style={styles.header}>
          <button type="button" name="add" onClick={handleAddUser} style={styles.addButton}>➕ 추가</button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>no</th>
              <th style={styles.th}>사원번호</th>
              <th style={styles.th}>팀</th>
              <th style={styles.th}>직책</th>
              <th style={styles.th}>이름</th>
              <th style={styles.th}>이메일</th>
              <th style={styles.th}>권한</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user,index) => (
              <tr key={user.userId} style={styles.tr}>
                <td style={styles.td}>{index +1}</td>
                <td style={styles.td}>doc-{user.userId}</td>
                <td style={styles.td}>{user.teamName}</td>
                <td style={styles.td}>{user.positionName}</td>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{getRoleLabel(user.role)}</td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => handleEditUser(user.userId)}
                    style={{ cursor: 'pointer', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', padding: '4px 8px' }}
                  >
                    수정
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

const styles = {
  header: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  borderBottom: '3px solid transparent',
  
},
addButton: {
  backgroundColor: '#454f7cff',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  fontSize: '14px',
  cursor: 'pointer',
  borderRadius: '4px',
},
  container: {
    display: 'flex',
  },
  mainContent: {
    flex: 1,
    padding: '30px',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    backgroundColor: '#454f7cff',
    color: 'white',
    fontWeight: 'bold',
    borderBottom: '2px solid #dee2e6',
  },
  tr: {
    borderBottom: '1px solid #dee2e6',
  },
  td: {
    padding: '12px',
    color: '#333',
  },
  status: {
    padding: '50px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  },
};

export default UserList;