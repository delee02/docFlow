import React, { useState, useEffect, useRef } from "react";
import api from '../../api/api'
const ApprovalModal = ({ userId, docId, onClose }) => {
  const modalRef = useRef(null);
console.log("user: ", userId, "doc:",docId);
  // 모달 밖 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleApproval = async () => {
    api.post('approval/approvedDoc', {
      docId,
      userId
    })
    .then(res => {
      console.log("승인 완료", res.data);
    })
    .catch(err => {
      console.error("승인 실패", err);
    });
  };


  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    zIndex: 1001,
    width: 320,
    maxHeight: 400,
    overflowY: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    overflow: "hidden",
   };

  return (
    <>
      {/* 배경 흐림 */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      />
      {/* 모달 */}
      <div style={modalStyle} ref={modalRef}>
        <input
          type="text"
          placeholder="승인, 반려 이유"
          style={{
            width: "90%",
            marginBottom: 12,
            padding: "8px 10px",
            fontSize: 14,
            borderRadius: 6,
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        {/* JSX - inline style */}
        <button
          type="button"
          onClick={handleApproval}
          style={{
            padding: '8px 16px',
            margin: '4px',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: '#454f7cff',
            color: 'white',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#252d4eff'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#454f7cff'}
        >
          승인
        </button>

        <button
          type="button"
          style={{
            padding: '8px 16px',
            margin: '4px',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: '#f44336',
            color: 'white',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
        >
          반려
        </button>
      </div>
    </>
  );
};

export default ApprovalModal;
