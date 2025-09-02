import React, { useState, useEffect } from "react";
import api from "../../api/api";
import "../../css/ChatModal.css";

const SearchModal = ({ type, onClose, handleNewChat }) => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const userName = localStorage.getItem('userName');
  const userId = localStorage.getItem('userId');

  // API 호출
  useEffect(() => {
    api
      .get("user/list")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("유저리스트 가져오기 실패", err));
  }, []);

  // 검색 필터
  const filtered = users.filter((u) => u.name.includes(query));

  // 팀별 그룹화
  const groupedUsers = filtered.reduce((acc, user) => {
    if (!acc[user.teamName]) acc[user.teamName] = [];
    acc[user.teamName].push(user);
    return acc;
  }, {});

  // 그룹 선택 토글
  const toggleUser = (user) => {
    const userId = user.userId || user.id;
    setSelected((prev) => {
      const exists = prev.find((u) => u.id === userId);
      if (exists) return prev.filter((u) => u.id !== userId);
      return [...prev, { id: user.userId, name: user.name }];
    });
  };

  return (
    <div className="modal-search">
      <div className="modal-search-content">
        <button onClick={onClose} className="search-close-btn">X</button>

        <h2>{type === "DIRECT" ? "Direct Message" : "Group Chat"}</h2>

        <input
          type="text"
          placeholder="사용자 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input"
        />

        <ul className="list">
          {Object.entries(groupedUsers).map(([team, members]) => (
            <li key={team} className="team-group">
              <div className="team-name">{team}</div>
              <ul>
                {members
                .filter((user) => user.userId !== Number(userId))
                .map((user) => (
                  <li key={user.userId}>
                    <button
                      className="list-item"
                      onClick={() =>
                        type === "DIRECT"
                          ? (handleNewChat({
                              type: "DIRECT",
                              users: [user.userId],
                              name: user.name,
                            }),
                            onClose())
                          : toggleUser(user)
                      }
                    >
                      <span className="user-name">{user.name}</span>
                      <span className="user-info">{user.positionName}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {type === "GROUP" && selected.length > 0 && (
          <div className="selected-users">
            {selected.map((u) => (
              <span
                key={u.id}
                className="selected-user"
                onClick={() => toggleUser(u)}
              >
                {u.name} ✕
              </span>
            ))}
          </div>
        )}

        {type === "GROUP" && (
          <button
            className="btn group-btn"
            onClick={() => {
              if (selected.length < 2) {
                alert("그룹은 2명 이상 선택해야 합니다.");
                return;
              }
              const roomName = [...selected.map(u => u.name), userName].join(", ");
              handleNewChat({
                type: "GROUP",
                users: selected.map((u) => u.id),
                name: roomName,
              });
              onClose();
            }}
          >
            그룹 만들기
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
