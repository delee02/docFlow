import React from 'react';

const Layout = ({ children }) => {
    const userName = localStorage.getItem('userName') || '사용자';

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>{userName}님 안녕하세요</div>
      </header>
      <main style={styles.content}>
        {children}
      </main>

      <footer style={styles.footer}>푸터 영역</footer>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
  backgroundColor: '#ffffffff',
  borderStyle: 'solid',   // 하이픈 대신 카멜케이스
  borderWidth: '1px',     // 숫자만 쓰면 px 자동 적용되기도 함
  borderColor: 'red',
  color: 'black',
  padding: '10px 20px',
},
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffffff',
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    padding: '10px 20px',
    textAlign: 'center',
  },
};

export default Layout;