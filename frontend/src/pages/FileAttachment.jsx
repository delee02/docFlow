import React, { useState } from 'react';

const FileAttachment = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // 파일 여러 개 선택 가능
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label htmlFor="file-upload" style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
        파일 첨부하기
      </label>
      <input
        id="file-upload"
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {files.length > 0 && (
        <ul style={{ marginTop: 10 }}>
          {files.map((file, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
              <span style={{ marginRight: 8 }}>{file.name}</span>
              <button onClick={() => handleRemoveFile(idx)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileAttachment;
