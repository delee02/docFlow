import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import TeamModal from './TeamModal';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const fetchTeams = async () => {
    try {
        const res = await api.get('/admin/team/list');
        setTeams(res.data);
      } catch (err) {
        console.error('팀 목록 로딩 실패', err);
      } finally {
        setLoading(false); 
      }
    };

    useEffect(() => {
      fetchTeams();
    }, []);

    const [editTeam, setEditTeam] = useState(null);
    const handleEditTeam = (team) => {
      setEditTeam(team);
      setModalOpen(true);
    };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>에러 발생: {error.message}</p>;

  return (
    <div style={styles.container}>
      <main style={styles.mainContent}>
        <div style={styles.header}>
          <button onClick={() => setModalOpen(true)} style={styles.addButton}>➕ 추가</button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>no</th>
              <th style={styles.th}>팀</th>
              <th style={styles.th}> </th>

            </tr>
          </thead>
          <tbody>
            {teams.map((team,index) => (
              <tr key={team.teamId} style={styles.tr}>
                <td style={styles.td}>{index+1}</td>
                <td style={styles.td}>{team.teamName}</td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => handleEditTeam(team)}
                    style={{ cursor: 'pointer', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', padding: '4px 8px' }}
                  >
                    수정
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <TeamModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTeam(null);
        }}
        onTeamAdded={fetchTeams}
        editTeam={editTeam}
      />
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

export default TeamList;