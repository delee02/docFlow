import React from 'react';

const DashboardCards = ({ stats }) => {
  // stats 예시: { totalUsers: 100, newUsersToday: 5, ongoingDocs: 10, pendingApprovals: 3 }

  return (
    <div style={styles.cardContainer}>
      <StatCard title="총 사용자 수" value={stats.totalUsers} />
      <StatCard title="진행 중인 결재 문서" value={stats.ongoingDocs} />
      <StatCard title="미처리 결재 건" value={stats.pendingApprovals} />
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div style={styles.card}>
    <h3>{title}</h3>
    <p style={styles.value}>{value}</p>
  </div>
);

const styles = {
  cardContainer: {
    display: 'flex',
    gap: '20px',
    marginBottom: '40px',
  },
  card: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  value: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginTop: '10px',
  },
};

export default DashboardCards;
