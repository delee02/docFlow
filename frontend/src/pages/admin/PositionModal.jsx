import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import '../../css/Modal.css'
const PositionModal = ({isOpen, onClose, onPositionAdded, editPosition}) => {
    const [positionName , setPositionName] = useState('');
    const [level , setLevel] = useState('');

    useEffect(() =>{
        console.log('[MODAL OPEN] editPosition:', editPosition);
        if(isOpen &&editPosition){
            setPositionName(editPosition.positionName);
            setLevel(editPosition.level);
        }else{
            setPositionName('');
            setLevel('');
        }
    }, [isOpen,editPosition]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!positionName.trim()) return alert('직책을 입력하세요');
        const submitData = {
          positionName: positionName,
          level: Number(level),
        };

        try{
            if(editPosition){
                await api.post(`/admin/position/edit/${editPosition.positionId}`, submitData);
                alert('직책 수정 완료');
            }else{

                await api.post('/admin/position/new', submitData);
                alert('직책 추가 완료');
                setPositionName('');
                setLevel('');
            }
            onPositionAdded();
            onClose();
            
        }catch(err){
            console.error('직첵 추가 실패');
            alert('직책 추가 실패');
        }
    };

    if(!isOpen) return null;

    return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{editPosition ? '직책 수정' : '새 직책 추가'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={positionName}
            onChange={(e) => setPositionName(e.target.value)}
            placeholder="직책"
          />
          <input
            type="number"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            placeholder="레벨"
          />
          <button onClick={handleSubmit}>{editPosition ? '수정' : '추가'}</button>
          <button type="button" onClick={onClose}>취소</button>
        </form>
      </div>
    </div>
  );
};

export default PositionModal;
