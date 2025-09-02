import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/api';
import '../../css/UserForm.css';
import { Color } from '@tiptap/extension-text-style';

const roles = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_MANAGER'];
const statuses = ['ACTIVE', 'INACTIVE', 'PENDING'];

const UserForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    teamId: '',
    positionId: '',
    role: roles[0],
    status: statuses[0],
  });

  const [teams, setTeams] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    // 팀 목록 불러오기
    api.get('/admin/team/list')
      .then(res => setTeams(res.data))
      .catch(err => console.error('팀 목록 로딩 실패:', err));

    // 직책 목록 불러오기
    api.get('/admin/position/list')
      .then(res => setPositions(res.data))
      .catch(err => console.error('직책 목록 로딩 실패:', err));

    // 수정 모드일 경우 사용자 정보 불러오기
    if (userId) {
      api.get(`/admin/user/${userId}`)
        .then(res => {
          const user = res.data;
          setForm({
            name: user.name || '',
            email: user.email || '',
            password: '', // 비밀번호는 초기화
            teamId: user.teamId ? String(user.teamId) : '',
            positionId: user.positionId ? String(user.positionId) : '',
            role: user.role || roles[0],
            status: user.status || statuses[0],
          });
        })
        .catch(err => console.error('사용자 정보 로딩 실패:', err));
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 백엔드로 보낼 때 숫자 타입으로 변환
    const submitData = {
      ...form,
      teamId: Number(form.teamId),
      positionId: Number(form.positionId),
    };

    if (userId) {
      api.post(`/admin/user/edit/${userId}`, submitData)
        .then(() => {
          alert('사용자 수정 완료');
          navigate('/admin/team/list');
        })
        .catch(() => alert('수정 실패'));
    } else {
      api.post('/admin/user/new', submitData)
        .then(() => {
          alert('사용자 추가 완료');
          navigate('/admin/team/list');
        })
        .catch(() => alert('추가 실패'));
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2>{userId ? '사용자 수정' : '새 사용자 등록'}</h2>

        <label>이름:</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>비밀번호:</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required={!userId} />

        <label>이메일:</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>팀:</label>
        <select name="teamId" value={form.teamId} onChange={handleChange} required>
          <option value="">팀 선택</option>
          {teams.map(team => (
            <option key={team.teamId} value={String(team.teamId)}>
              {team.teamName}
            </option>
          ))}
        </select>

        <label>직책:</label>
        <select name="positionId" value={form.positionId} onChange={handleChange} required>
          <option value="">직책 선택</option>
          {positions.map(position => (
            <option key={position.positionId} value={String(position.positionId)}>
              {position.positionName}
            </option>
          ))}
        </select>

        <label>역할:</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="ROLE_ADMIN">관리자</option>
          <option value="ROLE_MANAGER">매니저</option>
          <option value="ROLE_USER">사용자</option>
        </select>

        <label>상태:</label>
        <select name="status" value={form.status} onChange={handleChange}>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <button type="submit">{userId ? '수정하기' : '등록하기'}</button>
      </form>
    </div>
  );
};

export default UserForm;