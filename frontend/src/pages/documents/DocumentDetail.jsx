import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../api/api";
import ApprovalModal from "./ApprovalModal";

const STATUS_COLOR = {
  SAVE: "#E0E0E0",
  IN_PROGRESS: "#BBDEFB",
  REJECTED: "#FFCDD2",
  COMPLETED: "#C8E6C9",
};

const DocumentDetailView = () => {
  const currentUser = Number(localStorage.getItem('userId'));
   const [showSearchModal, setShowSearchModal] = useState(false);    
  const { docId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    templateName: "",
    writer: { name: "-", positionName: "-", teamName: "-", id: "-" },
    approvers: [],
    status: "",
    content: "",
  });

  useEffect(() => {
    api.get(`/document/detail/${docId}`)
      .then(res => setForm(res.data))
      .catch(err => console.log(err));
  }, [docId]);

  const handleEdit = () => {
    navigate(`/document/edit/${docId}`);
      
  };

  const handleAddApproval = () => {
    setShowSearchModal(true);
  }
  const handleSubmitMyDoc = () => {
    api.post(`/document/submit/${docId}`);
  }

  useEffect(() => {
    if(form.writer?.id){
      localStorage.setItem('writer' , form.writer?.id);
    }
  },[form]);

  const displayApprovers = form.approvers.length > 0
    ? form.approvers
    : [{ positionName: '미지정', name: '', teamName: '', userId: null }];
            
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 30, backgroundColor: "#f0f2f5", display: "flex", justifyContent: "center" }}>
        <div style={{
          width: "100%",
          maxWidth: 1200,
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 30,
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          gap: 20
        }}>
          {/* 제목 + 템플릿 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ fontSize: 28, fontWeight: "bold" }}>{form.title}</h1>
            <span style={{ padding: "6px 12px", borderRadius: 8, backgroundColor: STATUS_COLOR[form.status] || "#F5F5F5" }}>
              {form.status}
            </span>
          </div>
          <div style={{ fontSize: 16, color: "#555" }}>종류: {form.templateType}</div>

          {/* 작성자 + 결재선 */}
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            {/* 작성자 정보 */}
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
                  ["사번", form.writer?.id],
                  ["부서", form.writer?.teamName],
                  ["직책", form.writer?.positionName],
                  ["이름", form.writer?.name],
                  

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

            {/* 결재자 테이블 */}
            <table style={{
              width: "max-content",
              border: "1px solid #ccc",
              borderCollapse: "collapse",
              tableLayout: "fixed",
              fontSize: 12,
              textAlign: "center",
              borderSpacing: 0,
              marginLeft: "auto"
            }}>
              <thead>
                
                <tr style={{ backgroundColor: "#ffffffff", height: 22 }}>
                  {displayApprovers.map(({ positionName }, idx) => (
                    <th key={idx} style={{ border: "1px solid #ccc", padding: 0, width: '100px' }}>
                      {positionName || '미지정'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ height: 60, backgroundColor: "#fff" }}>
                  {displayApprovers.map((_, idx) => (
                    <td key={idx} style={{ border: "1px solid #ccc" }} />
                  ))}
                </tr>
                <tr style={{ height: 20 }}>
                  {displayApprovers.map(({ name }, idx) => (
                    <td key={idx} style={{ border: "1px solid #ccc", fontWeight: "bold", padding: 0 }}>
                      {name}
                    </td>
                  ))}
                </tr>
                <tr style={{ height: 18, fontSize: 11, color: "#000000ff" }}>
                  {displayApprovers.map(({ teamName }, idx) => (
                    <td key={idx} style={{ border: "1px solid #ccc", padding: 0 }}>
                      {teamName}팀
                    </td>
                  ))}
                </tr>
                <tr style={{ height: 18, fontSize: 11, color: "#000000ff" }}>
                  {displayApprovers.map(({ status }, idx) => (
                    <td key={idx} style={{ border: "1px solid #ccc", padding: 0 }}>
                      {status}상태
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* 본문 */}
          <div style={{ border: "1px solid #ccc", borderRadius: 6, padding: 15, minHeight: 300 }}>
            <div dangerouslySetInnerHTML={{ __html: form.content || "<p>내용 없음</p>" }} readOnly/>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {/* 작성자인 경우 */}

            {form.writer?.id === currentUser  && form.status ==='DRAFT' &&(
                <button type="button" onClick={() => handleEdit(form)}>
                수정
                </button>
            )}
            {form.writer?.id === currentUser && form.status ==='DRAFT' && (
                <button type="button" onClick={() => handleSubmitMyDoc()}>
                제출
                </button>
            )}

            {/* 결재자인 경우 (status pending인 경우만) */}
            {displayApprovers.some(
                (a) => a.status === 'PENDING' && a.userId === currentUser
              ) && (
                <button type="button" onClick={handleAddApproval}>
                  결재
                </button>  
            )}
            {showSearchModal && (
              <ApprovalModal
               docId = {docId}
               userId = {currentUser}
              onClose={() => setShowSearchModal(false)}
              />
            )}
                          
            </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentDetailView;
