import { queryClient } from "./queryClient";

export function restoreDraft(userId){
    const queryKey = ["draft", userId];
    const savedDraft = queryClient.getQueryData(queryKey);
    if(savedDraft) {
        const confirmRestore = window.confirm(
            "이전에 작성 중인 문서가 있습니다. 이어쓰시겠습니까?"
        );
        if(confirmRestore){
            return savedDraft;
        }
    }
    return null;
}