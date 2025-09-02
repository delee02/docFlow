import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../css/LoginPage.css'; // CSS 파일로 분리

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/login', { email, password });
      const data = response.data;

      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userId', data.userId);

      if (!data.haveSign) {
        navigate("/signature/register");
      } else {
        navigate(data.role === 'ROLE_ADMIN' ? "/admin/dashboard" : "/dashboard");
      }
    } catch (error) {
      console.error('로그인 중 오류', error);
      alert('오류 발생');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">DocFlow 로그인</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
