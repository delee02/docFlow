import React, { useState, useEffect } from "react";
import api from '../../api/api';

const ApprovalLine = ({approvalFlow}) => {
    const defaultApprover = { positionName: '미지정', name: '', date: '' };
    const [writer ,setWriter] = useState({team: '-', position: '-', name: '-'});
    const [approvers, setApprovers] = useState([]);
    useEffect(() => {
      api.get('/user/me')
      .then(res => {
        setWriter({
          name: res.data.name,
          team: res.data.teamName,
          position: res.data.positionName,
        });
      })
      .catch(err => {
        console.log('유저 정보가져오기 실패', err);
      });
  
    }, []);

    useEffect(() => {
      if(!approvalFlow || approvalFlow.length === 0 ) return ;
      const levels = approvalFlow.map(a => a.level).join(',');
      console.log("level:", levels);
      api.get(`/approval/flowUser?levels=${levels}`)
        .then(res => {
          setApprovers(res.data);
        })
        .catch(err => {
          console.log('결재자 정보 가져오기 실패', err);
        })
    }, [approvalFlow]);

    const displayApprovers = approvers.length > 0 ? approvers : [defaultApprover, defaultApprover, defaultApprover];

    const handleAddApprover = () => {
      const newApprover = {
        userId: null,
        name: '',
        positionName: '',
        date: '',
      };
      setApprovers(prev => [newApprover, ...prev]);
    };

  
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
            ["부서", writer.team],
            ["직책", writer.position],
            ["이름", writer.name],
          ].map(([label, value], i) => (
            <tr key={i} style={{ height: 20 }}>
              <th style={{
                border: "1px solid #ccc",
                padding: "0 4px",
                textAlign: "center",
                backgroundColor: "#f9f9f9",
                fontWeight: "normal",
                width: "40%",
                lineHeight: 1.1
              }}>
                {label}
              </th>
              <td style={{
                border: "1px solid #ccc",
                padding: "0 4px",
                textAlign: "left",
                textAlign: "center",
                lineHeight: 1.1
              }}>
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={{display: "flex", alignItems: "center", gap: 8, marginBottom: 10 ,marginLeft: "auto",}}>
      <button onClick={handleAddApprover} style={{
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
          <tr style={{ backgroundColor: "#f9f9f9", height: 22 }}>
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
            {displayApprovers.map(({ date }, idx) => (
              <td
                key={idx}
                style={{
                  border: "1px solid #ccc",
                  padding: 0
                }}
              >
                {date}
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