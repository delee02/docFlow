import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";


const uploadSignImage = async (userId, dataURL) => {
     if (!dataURL) throw new Error("이미지 데이터 없음");

  // storage가 undefined가 아닌지 확인
  if (!storage) throw new Error("Storage가 초기화되지 않았습니다");

  try {
    // 로그인한 사용자 UID 기준으로 경로 생성
    const storageRef = ref(storage, `signature/${userId}.png`);

    await uploadString(storageRef, dataURL, "data_url");

    const url = await getDownloadURL(storageRef);
    console.log("✅ 업로드 성공, URL:", url);
    return url;
  } catch (err) {
    console.error("firebase 서명 업로드 오류", err);
    throw err;
  }
};

export default uploadSignImage;