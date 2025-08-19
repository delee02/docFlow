import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/api'

const DocumentList = () => {
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

    
    return (<div style={styles.container}>
        <div>
        <Sidebar/>
        </div>
      <main style={styles.mainContent}>
        <div style={styles.header}>
          <button type="button" name="add" style={styles.addButton}>➕ 추가</button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>no</th>
              <th style={styles.th}>종류</th>
              <th style={styles.th}>제목</th>
              <th style={styles.th}>진행상황</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {approval.map((doc,index) => (
              <tr key={doc.id} style={styles.tr}>
                <td style={styles.td}>{index +1}</td>
                <td style={styles.td}>{doc.templateType}-{doc.id}</td>
                <td style={styles.td}>{doc.title}</td>
                <td style={styles.td}>{doc.status}</td>
                
                <td style={{ padding: '12px' }}>
                  <button
                    style={{ cursor: 'pointer', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', padding: '4px 8px'}}
                    onClick={() => handleDocument(doc.id)}
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
addButton: {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  fontSize: '14px',
  cursor: 'pointer',
  borderRadius: '4px',
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
    textAlign: 'left',
    padding: '12px',
    backgroundColor: '#454f7cff',
    color: 'white',
    fontWeight: 'bold',
    borderBottom: '2px solid #dee2e6',
  },
  tr: {
    borderBottom: '1px solid #dee2e6',
  },
  td: {
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



export default DocumentList;