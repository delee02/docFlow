import React, { useState, useEffect, useRef } from "react";

const UserSearchModal = ({ users = [], onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users || []);
  const modalRef = useRef(null);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

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

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredUsers(
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(term.toLowerCase()) ||
          u.positionName.toLowerCase().includes(term.toLowerCase()) ||
          u.teamName.toLowerCase().includes(term.toLowerCase())
      )
    );
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
        <h3 style={{ marginBottom: 12, fontSize: 18, fontWeight: "bold" }}>
          결재자 검색
        </h3>
        <input
          type="text"
          placeholder="이름, 팀, 직책 검색"
          value={searchTerm}
          onChange={handleSearchChange}
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
        <div style={{ maxHeight: 300, overflowY: "auto" }}>
          {filteredUsers.map((user) => (
            <div
              key={user.userId}
              onClick={() => onSelect(user)}
              style={{
                padding: "8px 10px",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f5f5f5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <div style={{ fontWeight: "500" }}>{user.name}</div>
              <div
                style={{
                  fontSize: 12,
                  color: "#666",
                  marginTop: 2,
                }}
              >
                {user.teamName} | {user.positionName}
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div
              style={{
                padding: 8,
                color: "#999",
                textAlign: "center",
                fontSize: 14,
              }}
            >
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserSearchModal;
