import { queryClient } from "./queryClient";

export function restoreDraft(userId) {
    const queryKey = ["draft", userId];
    const savedDraft = queryClient.getQueryData(queryKey);

    if (!savedDraft) return null;

    const confirmRestore = window.confirm(
        "이전에 작성 중인 문서가 있습니다. 이어서 작성하시겠습니까?"
    );

    // 취소하면 null 반환
    return confirmRestore ? savedDraft : null;
}