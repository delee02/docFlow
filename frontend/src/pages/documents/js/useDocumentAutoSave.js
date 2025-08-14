import { useEffect } from "react";
import { queryClient } from "./queryClient";

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
        },10000); //1분마다 저장ㄱㄱ
        return () => clearInterval(interval);
    },[queryKey,documentId,title, templateType, approvers, writer, editor]);

    //서버 redis에 저장
    useEffect(() => {
    const handleUnload = (e) => {
        console.log("beforeunload fired", queryClient.getQueryData(queryKey)); // << 페이지 떠날 때 로그 확인
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
        console.log("state",state);
        if (state) {
            const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
            navigator.sendBeacon("http://localhost:8080/document/autoSave");
        }
        e.preventDefault();
        e.returnValue = '';
    };

    window.addEventListener("beforeunload", handleUnload);
    console.log("beforeunload listener added"); // << 마운트 시점 확인

    return () => window.removeEventListener("beforeunload", handleUnload);
}, []);
}