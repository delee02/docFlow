import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/api'


const ApprovalList = () => {
    const navigate = useNavigate();
    const [approval, setApproval] = useState([]);
    useEffect (() => {
        api.get("/document/myApprovalList")
        .then(res => setApproval(res.data))
        .catch(err => console.error('서류 목록 로딩 실패:', err));

    },[]);

    //해당문서로 가기
    const handleDocument = (docId) => {
      navigate(`/document/detail/${docId}`);
    } 

    const documnetStatus = {
      APPROVED : "완료",
      IN_PROGRESS : "진행중",
      DRAFT : "초안",
      REJECTED : "반려",
    }

    const STATUS_COLOR = {
      DRAFT: "#E0E0E0",
      IN_PROGRESS: "#BBDEFB",
      REJECTED: "#FFCDD2",
      COMPLETED: "#C8E6C9",
    };

    
    return (<div style={styles.container}>
        <div>
        <Sidebar/>
        </div>
      <main style={styles.mainContent}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>no</th>
              <th style={styles.th}>종류</th>
              <th style={styles.th}>제목</th>
              <th style={styles.th}>기안자</th>
              <th style={styles.th}>진행상황</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {approval.map((app,index) => (
              <tr key={app.id} style={styles.tr}>
                <td style={styles.td}>{index +1}</td>
                <td style={styles.td}>doc-{app.id}</td>
                <td style={styles.td}>{app.title}</td>
                <td style={styles.td}>{app.userName}</td>
                <td>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: 8,
                    backgroundColor: STATUS_COLOR[app.status] || "#F5F5F5",
                    whiteSpace: 'nowrap',     // 글자가 한 줄에서 줄바꿈되지 않도록
                    textAlign: 'center',      // 글자 가운데 정렬
                    width: '50px',               // 최소 폭, 내용에 따라 늘어남
                  }}>
                  {documnetStatus[app.status] || app.status}
                  </div>
                </td>
                
                <td style={{ padding: '12px' }}>
                  <button
                    style={{ cursor: 'pointer', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', padding: '4px 8px'}}
                    onClick={() => handleDocument(app.id)}
                  >
                    자세히 보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

const styles = {
  header: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  borderBottom: '3px solid transparent',
  
},
  container: {
    display: 'flex',
  },
  mainContent: {
    flex: 1,
    padding: '30px',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
  },
  th: {
    textAlign: 'center',
    padding: '12px',
    backgroundColor: '#454f7cff',
    color: 'white',
    fontWeight: 'bold',
    borderBottom: '2px solid #dee2e6',
  },
  tr: {
    textAlign: 'center',
    borderBottom: '1px solid #dee2e6',
  },
  td: {
    textAlign: 'center',
    padding: '12px',
    color: '#333',
  },
  status: {
    padding: '50px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  },
};



export default ApprovalList;