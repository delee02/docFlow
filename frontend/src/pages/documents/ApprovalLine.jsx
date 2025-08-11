import React, { useState, useEffect } from "react";
import api from '../../api/api';

const ApprovalLine = () => {
    const approvers = [
        { name: '홍길동', position: '기안', date: '2025-08-11' },
        { name: '김철수', position: '결재', date: '2025-08-12' },
        { name: '박영희', position: '결재', date: '2025-08-13' },
        { name: '최민수', position: '최종결재', date: '2025-08-14' },
        ];
        const [writer ,setWriter] = useState({team: '-', position: '-', name: '-'});
        
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

    {/* 결재자 정보 테이블 */}
    <table style={{
      width: "45%",
      border: "1px solid #ccc",
      borderCollapse: "collapse",
      marginLeft: "auto",
      tableLayout: "fixed",
      fontSize: 12,
      textAlign: "center",
      borderSpacing: 0
    }}>
      <thead>
        <tr style={{ backgroundColor: "#f9f9f9", height: 22 }}>
          {approvers.map(({ position }, idx) => (
            <th
              key={idx}
              style={{
                border: "1px solid #ccc",
                padding: 0
              }}
            >
              {position}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* 직인 자리 */}
        <tr style={{ height: 60, backgroundColor: "#fff" }}>
          {approvers.map((_, idx) => (
            <td key={idx} style={{ border: "1px solid #ccc" }} />
          ))}
        </tr>
        {/* 이름 */}
        <tr style={{ height: 20 }}>
          {approvers.map(({ name }, idx) => (
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
          {approvers.map(({ date }, idx) => (
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
  );
};

export default ApprovalLine;