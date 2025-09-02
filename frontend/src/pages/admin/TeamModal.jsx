import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import '../../css/AdminModal.css'
const TeamModal = ({isOpen, onClose, onTeamAdded, editTeam}) => {
    const [teamName , setTeamName] = useState('');

    useEffect(() =>{
        console.log('[MODAL OPEN] editTeam:', editTeam);
        if(isOpen &&editTeam){
            setTeamName(editTeam.teamName);
        }else{
            setTeamName('');
        }
    }, [isOpen,editTeam]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!teamName.trim()) return alert('팀 이름을 입력하세요');

        try{
            if(editTeam){
                await api.post(`/admin/team/edit/${editTeam.teamId}`, {teamName});
                alert('팀 수정 완료');
            }else{
                await api.post('/admin/team/new', {teamName});
                alert('팀 추가 완료');
                setTeamName('');
            }
            onTeamAdded();
            onClose();
            
        }catch(err){
            console.error('팀 추가 실패');
            alert('팀 추가 실패');
        }
    };

    if(!isOpen) return null;

    return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{editTeam ? '팀 수정' : '새 팀 추가'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="팀 이름"
          />
          <button onClick={handleSubmit}>{editTeam ? '수정' : '추가'}</button>
          <button type="button" onClick={onClose}>취소</button>
        </form>
      </div>
    </div>
  );
};

export default TeamModal;
