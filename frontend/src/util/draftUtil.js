import { queryClient } from "../pages/documents/js/queryClient";
import api from "../api/api";

//react-query에서 가져오기
export const restoreDraft = (userId) => {
    const key = ["draft", userId];
    const savedDraft = queryClient.getQueryData(key);

    if(!savedDraft) return null;

    const confirmRestore = window.confirm(
        "이전에 작성 중이던 문서가 있습니다. 이어서 작성하실?"
    );

    return confirmRestore? savedDraft : null;
}

//redis에서 가져오기
export const fetchRedisDraft = async () => {
    try{
        const res = await api.get(`/document/autoSave`);
        return res.data || null;
    }catch (err){
        console.log("redis 가져오기 실해",err);
        return null;
    }
};

export const fetchDBDraft = async (docId) => {
    try{
        const res = await api.get(`/document/detail/${docId}`);
        return res.data || null;
    }catch(err){
        console.log("디비에서 문서 가져오기 실패",err);
        return null;
    }
};
