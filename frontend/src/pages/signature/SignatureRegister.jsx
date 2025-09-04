import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import api from '../../api/api';
import '../../css/SignatureModal.css';
import { useNavigate } from 'react-router-dom';
import uploadSignImage from "../../firebase/uploadSignImage";

export default function SignatureModal() {
  const navigate = useNavigate();
  const sigCanvas = useRef();
  const userId = localStorage.getItem('userId');
  const [signatures, setSignatures] = useState([]);
  const [baseVector, setBaseVector] = useState(null);
  const tolerance = 0.5;
  const tolerance2 = 50;

  const handleSave = () => {
    if (sigCanvas.current.isEmpty()) {
      alert("싸인이 없습니다.");
      return;
    }

    const dataURL = sigCanvas.current.toDataURL(); // 이미지
    const vector = sigCanvas.current.toData().flat(); // 좌표 벡터

    if (vector.length === 0) {
      alert("좌표가 너무 적습니다. 다시 시도해주세요.");
      return;
    }

    if (signatures.length === 0) {
      setBaseVector(vector);
    } else {
      const ratio = Math.abs(vector.length - baseVector.length) / baseVector.length;
      if (ratio > tolerance) {
        alert("첫 번째 싸인과 좌표 수가 너무 다릅니다. 다시 입력해주세요.");
        sigCanvas.current.clear();
        return;
        }
        if (!isSimilarVector(baseVector, vector, tolerance2)) {
        alert("첫 번째 싸인과 형태가 너무 다릅니다. 다시 입력해주세요.");
        sigCanvas.current.clear();
        return;
      }
    }

    setSignatures(prev => [...prev, { image: dataURL, vector }]);
    sigCanvas.current.clear();
  };

  const handleSubmit = async () => {
    if (signatures.length < 3) {
      alert("평균 계산을 위해 세 번 싸인해주세요.");
      return;
    }

    // 안전하게 첫 번째 싸인 확인
    const firstSignature = signatures[0];
    if (!firstSignature || !firstSignature.image) {
      alert("첫 번째 싸인 이미지가 없습니다.");
      return;
    }

    try {
      console.log(firstSignature.image, "이미지");
      const avgVector = calculateAverageVector(signatures.map(s => s.vector));
      const url = await uploadSignImage(userId, firstSignature.image); // Firebase 업로드

      const role = localStorage.getItem('role');
      await api.post("/signature/register", {
        userId,
        imgUrl: url
      });

      alert("싸인 등록 완료");
      setSignatures([]);
      onClose();
    } catch (err) {
      console.error(err);
      alert("싸인 등록 실패");
    }
  };

  const onClose = () => {
    const role = localStorage.getItem('role');
    if (role === 'ROLE_ADMIN') {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>싸인 등록</h3>
        <SignatureCanvas
          ref={sigCanvas}
          backgroundColor="#fff"
          penColor="#454f7cff"
          canvasProps={{ width: 500, height: 250, className: 'sig-canvas' }}
        />
        <div className="button-group">
          <button className="btn save" onClick={handleSave}>저장</button>
          <button className="btn submit" onClick={handleSubmit}>등록</button>
          <button className="btn close" onClick={onClose}>닫기</button>
        </div>
        <div className="sign-count">현재 저장된 싸인 수: {signatures.length} / 3</div>
      </div>
    </div>
  );
}

// 평균 벡터 계산
function calculateAverageVector(vectors) {
  const minLen = Math.min(...vectors.map(v => v.length));
  const avg = [];
  for (let i = 0; i < minLen; i++) {
    const sumX = vectors.reduce((a, v) => a + v[i].x, 0);
    const sumY = vectors.reduce((a, v) => a + v[i].y, 0);
    avg.push({ x: sumX / vectors.length, y: sumY / vectors.length });
  }
  return avg;
}

// 유사도 체크
function isSimilarVector(base, compare, tolerance) {
  const len = Math.min(base.length, compare.length);
  let sum = 0;
  for (let i = 0; i < len; i++) {
    const dx = base[i].x - compare[i].x;
    const dy = base[i].y - compare[i].y;
    sum += Math.hypot(dx, dy);
  }
  const avgDistance = sum / len;
  return avgDistance <= tolerance;
}
