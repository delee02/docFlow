import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
      e.preventDefault();

      try{
          const response = await api.post('/login', { email, password});
          const data = response.data;

          localStorage.setItem('accessToken', data.token);
          localStorage.setItem('userName', data.name);
          localStorage.setItem('role',data.role);

          if(data.role === 'ROLE_ADMIN'){
            navigate("/admin/dashboard");
          }else {
            navigate("/dashboard");
          }

          
      }catch(error){
          console.error('로그인 중 오류', error);
          alert('오류 발생');
      }
  };

  return (
    <div style={styles.container}>
      <h2>사내 전자결재 로그인</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input type="email" placeholder="이메일" value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>로그인</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '100px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
  },
  input: {
    padding: '10px',
    marginBottom: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default LoginPage;
