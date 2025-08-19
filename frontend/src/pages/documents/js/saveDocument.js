import api from '../../../api/api';
import { queryClient } from './queryClient';


    export const saveDocument = async ({
        editor,
        docId,
        title,
        selectedTemplateId,
        writer,
        approvers,
        navigate
        }) => {
        if (!editor) return;
            
        const payload = {
            id: docId || null,
            title,
            templateType: selectedTemplateId,
            writer: {
            id: writer.id,
            name: writer.name,
            teamName: writer.team,
            positionName: writer.position
            },
            approvers: approvers.map((approver, idx) => ({
            userId: approver.userId,
            name: approver.name,
            teamName: approver.teamName,
            positionName: approver.positionName,
            date: approver.date || '',
            approvalOrder: idx + 1 
            })),
            content: editor.getHTML() // editor 내용도 포함해야 저장 가능
        };
        try {
            if(docId){
                const res = await api.post('/document/update', payload);
                console.log("수정성공", res.data);
                queryClient.removeQueries(['draft', writer.id]);
                alert("문서가 수정되었습니다.");
                navigate('/dashboard'); 

            }else{
                const res = await api.post('/document/save', payload);
                console.log("저장성공", res.data);
                queryClient.removeQueries(['draft', writer.id]);
                alert("문서가 저장되었습니다.");
                navigate('/dashboard'); 
            }

        } catch (err) {
            console.log("저장 실패", err);
        }
    };
