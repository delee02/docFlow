import React ,{useRef, useState} from "react";
import SignatureCanvas from "react-signature-canvas";
import api from '../../api/api'

export default function SignatureRegister() {
    const userId = localStorage.getItem('userId');
    const sigCanvas =useRef();
    const [signatures, setSignatures] = useState([]);
    const [baseVector, setBaseVector] = useState(null);
    const tolerance = 0.001;
    const tolerance2 = 110;

    const handleSave = () => {
        if(sigCanvas.current.isEmpty()) return;

        const dataURL = sigCanvas.current.toDataURL(); //이미지
        const vector = sigCanvas.current.toData().flat(); //좌표 백터
        if (vector.length === 0) {
            alert("좌표가 너무 적습니다. 다시 시도해주세요.");
            return;
        }

        if(signatures.length === 0){ //첫번째싸인일경우 길이저장 
                setBaseVector(vector.length);    
        }else{
            const ratio = Math.abs(vector.length - baseVector.length) / baseVector.length;
            if (ratio > tolerance) {
                alert("첫 번째 싸인과 좌표 수가 너무 다릅니다. 다시 입력해주세요.");
                sigCanvas.current.clear();
                return;
            } 
             // 평균 벡터 거리 확인
            if (!isSimilarVector(baseVector, vector, tolerance2)) {
                alert("첫 번째 싸인과 형태가 너무 다릅니다. 다시 입력해주세요.");
                sigCanvas.current.clear();
                return;
            }
        }
        setSignatures([...signatures, {image: dataURL, vector}]);
        sigCanvas.current.clear();
    };

    const handleSubmit = async () =>{
        if(signatures.length <3){
            alert("평균 계산을 위해 세 번 싸인해주세요.");
            return;
        }
        const avgVector = calculateAverageVector(signatures.map(s=>s.vector));

        try {
            await api.post("/signature/register", {
                userId,
                avgVector,
                images: signatures.map(s => s.image), // Firebase 이미지 저장용
            });
            alert("싸인 등록 완료");
            setSignatures([]); // 등록 후 초기화
            } catch (err) {
            console.error(err);
            alert("싸인 등록 실패");
        }   

    };

    return (
        <div>
            <SignatureCanvas ref={sigCanvas} 
                backgroundColor="white" penColor ="black"
                canvasProps={{width:400, height:200}}/>
            <button onClick={handleSave}>저장</button>
            <button onClick={handleSubmit}>등록</button>
            <div>현재 저장된 싸인 수: {signatures.length} / 3</div>
        </div>
    );
}

function calculateAverageVector(vectors){
    const minLen = Math.min(...vectors.map(v=>v.length));//가장 짧은 싸인 기준
    const avg = [];
    for(let i=0;i<minLen;i++){
        const sumX = vectors.reduce((a,v) => a + v[i].x ,0);
        const sumY = vectors.reduce((a,v) => a + v[i].y, 0);
        avg.push({x: sumX /vectors.length, y: sumY/vectors.length});
    }
    return avg;
};

// 평균 벡터 거리 기반 유사도 검사
function isSimilarVector(base, compare, tolerance) {
  const len = Math.min(base.length, compare.length);
  let sum = 0;
  for (let i = 0; i < len; i++) {
    sum += Math.hypot(base[i].x - compare[i].x, base[i].y - compare[i].y);
  }
  const avgDistance = sum / len;
  return avgDistance <= tolerance;
}
