import { useEffect } from "react";
import { queryClient } from "./queryClient";
import api from '../../../api/api'

export function useDocumentAutoSave({documentId, writer, title, templateType, approvers, editor}){
    const queryKey = ["draft", writer.id]; //한사람 하나씩만!

    useEffect(() => {
        const interval = setInterval(() => {
            queryClient.setQueryData(queryKey, {
                title,
                templateType,
                approvers,
                writer,
                content: editor.getHTML(),
                documentId: documentId || null,
                updatedAt: Date.now(),
            });
            console.log("💾 캐싱 완료", queryKey, editor.getHTML().slice(0, 50));
        },10000); 
        return () => clearInterval(interval);
    },[queryKey,documentId,title, templateType, approvers, writer, editor]);

    //서버 redis에 저장
    useEffect(() => {
    const saveDraftToServer = () => {
      const state = {
        title,
        templateType,
        approvers,
        writer,
        content: editor?.getHTML() || '',
        documentId: documentId || null,
        updatedAt: Date.now(),
      };
      queryClient.setQueryData(queryKey, state);

      // axios POST로 Redis에 저장
      api.post("/document/autoSave", state)
        .then(() => console.log("✅ 서버 Draft 저장 완료"))
        .catch(err => console.error("❌ Draft 저장 실패", err));
    };

    //사용자가 탭을 숨기거나 다른 앱으로 이동할 때 Draft를 서버에 저장
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveDraftToServer();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);

    // beforeunload 이벤트 브라우저에서 페이지를 닫거나 새로고침할 때 발생
    const handleBeforeUnload = (e) => {
      saveDraftToServer();
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [queryKey, documentId, title, templateType, approvers, writer, editor]);
}