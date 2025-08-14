import React, { useState, useEffect } from "react";
import api from '../../api/api';
import UserSearchModal from './UserSearchModal';  
import { CiCircleMinus } from "react-icons/ci";

const ApprovalLine = ({ approvalFlow, users, approvers, setApprovers, writer, setWriter }) => {
  const defaultApprover = { positionName: '미지정', name: '', date: '' };

  // 결재자 수동선택을 위한 검색 모달
  const [showSearchModal, setShowSearchModal] = useState(false);    

  const handleAddApproverClick = () => {
    if (!users || users.length === 0) {
    alert("사용자 목록을 불러오는 중입니다. 잠시만 기다려주세요.");
    return;
  }
    setShowSearchModal(true);
  }
  const handleUserSelect = (user) => {
    setApprovers(prev => [
      ...prev,
      {
        userId: user.userId,
        name: user.name,
        teamName: user.teamName,
        positionName: user.positionName,
        date: '',
      }
    ]);
    setShowSearchModal(false);
  }

  const handleRemoveApprover = (index) => {
    setApprovers(prev => prev.filter((_, i) => i !== index));
  };

  // 작성자 정보 가져오기 (캐싱된 값 있으면 API 호출 안 함)
  useEffect(() => {
    if (writer && writer.id) return;

    api.get('/user/me')
      .then(res => {
        setWriter({
          id: res.data.userId,
          name: res.data.name,
          team: res.data.teamName,
          position: res.data.positionName,
        });
      })
      .catch(err => {
        console.log('유저 정보 가져오기 실패', err);
      });
  }, [writer, setWriter]);

  // 결재자 정보 가져오기 (캐싱된 approvers 있으면 API 호출 안 함)
  useEffect(() => {
    if (!approvalFlow || approvalFlow.length === 0) return;
    if (approvers && approvers.length > 0) return;

    const levels = approvalFlow.map(a => a.level).join(',');
    console.log("level:", levels);

    api.get(`/approval/flowUser?levels=${levels}`)
      .then(res => setApprovers(res.data || []))
      .catch(err => console.log('결재자 정보 가져오기 실패', err));
  }, [approvalFlow, approvers, setApprovers]);

  const displayApprovers = approvers && approvers.length > 0 ? approvers : [defaultApprover];

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
      {/* 작성자 정보 테이블 */}
      <table style={{
        width: "20%",
        border: "1px solid #ccc",
        borderCollapse: "collapse",
        tableLayout: "fixed",
        fontSize: 12,
        borderSpacing: 0
      }}>
        <tbody>
          {[
            ["사번", writer?.id],
            ["부서", writer?.team],
            ["직책", writer?.position],
            ["이름", writer?.name],
          ].map(([label, value], i) => (
            <tr key={i} style={{ height: 15 }}>
              <th style={{
                border: "1px solid #ccc",
                padding: "0 1px",
                textAlign: "center",
                backgroundColor: "#f9f9f9",
                fontWeight: "normal",
                width: "40%",
                lineHeight: "10px",
              }}>
                {label}
              </th>
              <td style={{
                border: "1px solid #ccc",
                padding: "0 2px",
                textAlign: "center",
                lineHeight: 1.1
              }}>
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, marginLeft: "auto" }}>
        <button onClick={handleAddApproverClick} style={{
          fontSize: 20,
          padding: '2px 8px',
          cursor: 'pointer',
          userSelect: 'none',
          height: 'fit-content',
          backgroundColor: '#ffffffff',
          color: '#000000ff',
          border: 'none',
          borderRadius: 4,
          lineHeight: 1,
        }}>+ </button> 

        {/* modal 부름 */}
        {showSearchModal && (
          <UserSearchModal
            users={users}
            onSelect={handleUserSelect}
            onClose={() => setShowSearchModal(false)}
          />
        )}

        {/* 결재자 정보 테이블 */}
        <table style={{
          width: "max-content",
          border: "1px solid #ccc",
          borderCollapse: "collapse",
          tableLayout: "fixed",
          fontSize: 12,
          textAlign: "center",
          borderSpacing: 0
        }}>
          <thead>
            <tr style={{ backgroundColor: "#fff", height: 22 }}>
              {displayApprovers.map((approver, idx) => (
                <th key={idx} style={{ border: "1px solid #ffffffff", borderBottom: "1px solid #ccc", width: '100px', textAlign: "center" }}>
                  {approver.userId && (
                    <button
                      onClick={() => handleRemoveApprover(idx)}
                      style={{
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        cursor: "pointer",
                      }}
                    >
                      <CiCircleMinus size={20} color="#ff4d4f" />
                    </button>
                  )}
                </th>
              ))}
            </tr>
            <tr style={{ backgroundColor: "#ffffffff", height: 22 }}>
              {displayApprovers.map(({ positionName }, idx) => (
                <th
                  key={idx}
                  style={{
                    border: "1px solid #ccc",
                    padding: 0,
                    width: '100px',  
                  }}
                >
                  {positionName || '미지정'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 직인 자리 */}
            <tr style={{ height: 60, backgroundColor: "#fff" }}>
              {displayApprovers.map((_, idx) => (
                <td key={idx} style={{ border: "1px solid #ccc" }} />
              ))}
            </tr>
            {/* 이름 */}
            <tr style={{ height: 20 }}>
              {displayApprovers.map(({ name }, idx) => (
                <td
                  key={idx}
                  style={{
                    border: "1px solid #ccc",
                    fontWeight: "bold",
                    padding: 0
                  }}
                >
                  {name}
                </td>
              ))}
            </tr>
            {/* 날짜 */}
            <tr style={{ height: 18, fontSize: 11, color: "#000000ff" }}>
              {displayApprovers.map(({ teamName }, idx) => (
                <td
                  key={idx}
                  style={{
                    border: "1px solid #ccc",
                    padding: 0
                  }}
                >
                  {teamName}팀
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovalLine;
