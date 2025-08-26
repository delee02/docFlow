import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage, auth } from "./firebase";

const uploadSignImage = async ({userId, dataURL}) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("로그인 필요");
  }

  try {
    // 로그인한 사용자 UID 기준으로 경로 생성
    const storageRef = ref(storage, `signature/${user.uid}.png`);

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