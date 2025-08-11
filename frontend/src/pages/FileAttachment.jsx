import React, { useState, useCallback } from 'react';

const FileAttachment = () => {
  const [files, setFiles] = useState([]);
  const [isDrag, setIsDrag] = useState(false);

  const addFiles = useCallback((newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  },[]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDrag(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDrag(false);
  };

  const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDrag(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
    e.dataTransfer.clearData(); // 브라우저 메모리 비움
  } 
  };

  return (
    <div>
      <div
        onDragOver = {handleDragOver}
        onDragLeave = {handleDragLeave}
        onDrop = {handleDrop}
        style={{
          border: `2px dashed ${isDrag ? 'blue' : '#ccc'}`,
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          background: isDrag ? '#f0f8ff' : 'transparent',
          cursor: 'pointer',
          marginBottom: '10px',
        }}
        onClick={() => document.getElementById('file-upload').click()}
      >
        {isDrag ? '여기에 파일을 놓으세요' : '파일을 드래그하거나 클릭해서 첨부하세요'}
      </div>
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
