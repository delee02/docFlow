package com.workflow.service;

import com.workflow.DTO.UserDto;
import com.workflow.DTO.request.ApproverRequest;
import com.workflow.DTO.request.DocumentRequest;
import com.workflow.DTO.request.WriterRequest;
import com.workflow.constants.APPROVALSTATUS;
import com.workflow.constants.DOCUMENTSTATUS;
import com.workflow.entity.ApprovalLine;
import com.workflow.entity.Document;
import com.workflow.entity.User;
import com.workflow.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final RedisTemplate redisTemplate;

    //서류 저장
    public void saveDocument(DocumentRequest request) {
        Document newDocument = dtoToEntity(request);
        String key = "draft:"+request.getWriter().getId();
        Boolean exist = Boolean.TRUE.equals(redisTemplate.hasKey(key));

        //redis 삭제
        if(exist) redisTemplate.delete(key);

        //바로 다음 사람 1번 approval status pending으로 바꾸기


        //디비 저장
        documentRepository.save(newDocument);
    }

    //서류 전체 리스트
    public List<DocumentRequest> getAllList() {
        List<Document> document = documentRepository.findAll();
        List<DocumentRequest> documentRequestList = new ArrayList<>();
        for(Document doc : document){
            documentRequestList.add(entityToDto(doc));
        }
        return documentRequestList;
    }

    //상태별로 가져오기
    public void getListByStatus(String status) {
    }

    /// //////////////mapper
    public DocumentRequest entityToDto(Document document){
        DocumentRequest documentRequest = new DocumentRequest();
        documentRequest.setTitle(document.getTitle());
        documentRequest.setTemplateType(document.getType());
        documentRequest.setContent(document.getContent());
        documentRequest.setStatus(document.getStatus());

        WriterRequest writer = new WriterRequest();
        writer.setId(document.getWriteId());
        writer.setName(document.getWriterName());
        writer.setTeamName(document.getWriterTeam());
        writer.setPositionName(document.getWriterPosition());
        documentRequest.setWriter(writer);

        List<ApproverRequest> approverRequests = new ArrayList<>();
        for(ApprovalLine approver : document.getApprovalLines()){
            ApproverRequest approverRequest = new ApproverRequest();
            approverRequest.setUserId(approver.getUserId());
            approverRequest.setName(approver.getName());
            approverRequest.setTeamName(approver.getTeamName());
            approverRequest.setPositionName(approver.getPositionName());
            approverRequest.setApprovalOrder(approver.getApprovalOrder());
            approverRequests.add(approverRequest);
        }
        documentRequest.setApprovers(approverRequests);

        return documentRequest;
    }

    public Document dtoToEntity(DocumentRequest request){
        Document document = new Document();
        document.setTitle(request.getTitle());
        document.setType(request.getTemplateType());
        document.setContent(request.getContent());
        document.setWriteId(request.getWriter().getId());
        document.setWriterName(request.getWriter().getName());
        document.setWriterTeam(request.getWriter().getTeamName());
        document.setWriterPosition(request.getWriter().getPositionName());

        //나중에 직책이나 팀 변하면 같이 변해는게 아니고 로그처럼 남아있어야해서
        List<ApprovalLine> approvalLines = new ArrayList<>();
        for(ApproverRequest approverRequest: request.getApprovers()){
            ApprovalLine approvalLine = new ApprovalLine();
            approvalLine.setUserId(approverRequest.getUserId());
            approvalLine.setName(approverRequest.getName());
            approvalLine.setTeamName(approverRequest.getTeamName());
            approvalLine.setPositionName(approverRequest.getPositionName());
            approvalLine.setDocument(document);
            approvalLine.setApprovalOrder(approverRequest.getApprovalOrder());
            if(approverRequest.getApprovalOrder() == 1) {
                approvalLine.setStatus(APPROVALSTATUS.PENDING);
            }
            approvalLines.add(approvalLine);
        }
        document.setApprovalLines(approvalLines);
        document.setCreateAt(LocalDateTime.now());
        document.setStatus(DOCUMENTSTATUS.IN_PROGRESS);

        return document;
    }

}
