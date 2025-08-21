package com.workflow.service;

import com.workflow.DTO.UserDto;
import com.workflow.DTO.request.ApproverRequest;
import com.workflow.DTO.request.DocumentRequest;
import com.workflow.DTO.request.WriterRequest;
import com.workflow.DTO.response.DocListResponse;
import com.workflow.DTO.response.DocumentResponse;
import com.workflow.DTO.response.MyApprovalListResponse;
import com.workflow.constants.APPROVALSTATUS;
import com.workflow.constants.DOCUMENTSTATUS;
import com.workflow.entity.ApprovalLine;
import com.workflow.entity.Document;
import com.workflow.entity.User;
import com.workflow.repository.ApprovalRepository;
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
    private final ApprovalRepository approvalRepository;
    private final RedisTemplate redisTemplate;

    //서류 저장
    public void saveDocument(DocumentRequest request) {
        Document newDocument = dtoToEntity(request);
        String key = "draft:"+request.getWriter().getId();
        Boolean exist = Boolean.TRUE.equals(redisTemplate.hasKey(key));

        //redis 삭제
        if(exist) redisTemplate.delete(key);

        //디비 저장
        documentRepository.save(newDocument);
    }
    //서류 업데이트
    public void updateDocument(DocumentResponse response) {
        Document updateDoc = documentRepository.findById(response.getId()).orElseThrow(() -> new NullPointerException("업데이트 할 문서 없음"));

        updateDoc.setTitle(response.getTitle());
        updateDoc.setContent(response.getContent());
        updateDoc.setType(response.getTemplateType());

        //나중에 직책이나 팀 변하면 같이 변해는게 아니고 로그처럼 남아있어야해서
        List<ApprovalLine> approvalLines = new ArrayList<>();
        for(ApproverRequest approverRequest: response.getApprovers()){
            ApprovalLine approvalLine = new ApprovalLine();
            approvalLine.setUserId(approverRequest.getUserId());
            approvalLine.setName(approverRequest.getName());
            approvalLine.setTeamName(approverRequest.getTeamName());
            approvalLine.setPositionName(approverRequest.getPositionName());
            approvalLine.setDocument(updateDoc);
            approvalLine.setApprovalOrder(approverRequest.getApprovalOrder());
            approvalLines.add(approvalLine);
        }
        updateDoc.getApprovalLines().clear();
        updateDoc.getApprovalLines().addAll(approvalLines);
        updateDoc.setUpdateAt(LocalDateTime.now());
        updateDoc.setWriteId(response.getWriter().getId());
        updateDoc.setWriterTeam(response.getWriter().getName());
        updateDoc.setWriterPosition(response.getWriter().getPositionName());

        documentRepository.save(updateDoc);
        String key = "draft:"+response.getWriter().getId();
        Boolean exist = Boolean.TRUE.equals(redisTemplate.hasKey(key));

        //redis 삭제
        if(exist) redisTemplate.delete(key);
    }

    //서류 전체 리스트
    public List<DocListResponse> getAllList(Long userId) {
        List<Document> document = documentRepository.findAllByWriteId(userId);
        List<DocListResponse> docListResponses = new ArrayList<>();
        for(Document doc : document){
            docListResponses.add(entityToListResDto(doc));
        }
        return docListResponses;
    }

    //상태별로 가져오기
    public void getListByStatus(String status) {
    }

    //해당 문서 정보 가져오기
    public DocumentRequest getDocDetail(Long docId) {
        Document document = documentRepository.findById(docId).orElseThrow(() -> new NullPointerException("문서 없음"));
        return entityToReqDto(document);
    }

    //기안 내는 사람이 제출 했을 때
    public void submitMydoc(Long docId) {
        //승인하는 사람 1의 status를 pending으로 서류 in Progress로 업데이트해야함
        Document document = documentRepository.findById(docId).orElseThrow(() -> new NullPointerException("문서 없음"));
        document.setStatus(DOCUMENTSTATUS.IN_PROGRESS);
        document.getApprovalLines().stream()
                .filter(a -> a.getApprovalOrder() == 1)
                .forEach(a -> a.setStatus(APPROVALSTATUS.PENDING));
    }

    //나랑 연관되어 있는 서류
    public List<DocListResponse> myApprovalList(Long userId) {
        try {
            //유저아이디로 approval_line에서 userId가 나고, status가 null이 아닌걸 가져온다. list
            List<Document> myApprovalList = documentRepository.findAllMyApproval(userId);
            //가져온 docId로 docList 맞춰 가져감
            List<DocListResponse> documentList = new ArrayList<>();
            for(Document doc : myApprovalList){
                entityToListResDto(doc);
                documentList.add(entityToListResDto(doc));
            }
            System.out.println(documentList);
            return documentList;
        }catch (Exception e){
            System.out.println("서류 가져오기 실패");
            e.printStackTrace();
            throw new RuntimeException("서류 조회 실패",e);
        }

    }

    /// //////////////mapper
    /// doc req
    public DocumentRequest entityToReqDto(Document document){
        DocumentRequest documentRequest = new DocumentRequest();
        documentRequest.setDocumentId(document.getId());
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
            approverRequest.setStatus(approver.getStatus() != null ? approver.getStatus().name() : "");
            approverRequests.add(approverRequest);
        }
        documentRequest.setApprovers(approverRequests);

        return documentRequest;
    }

    //docList response
    public DocListResponse entityToListResDto(Document document){
        DocListResponse docListResponse = new DocListResponse();
        docListResponse.setId(document.getId());
        docListResponse.setTitle(document.getTitle());
        docListResponse.setTemplateType(document.getType());
        docListResponse.setStatus(document.getStatus());
        docListResponse.setUserName(document.getWriterName());

        return docListResponse;
    }
    //doc response
    public DocumentResponse entityToResDto(Document document){
        DocumentResponse documentResponse = new DocumentResponse();
        documentResponse.setId(document.getId());
        documentResponse.setTitle(document.getTitle());
        documentResponse.setTemplateType(document.getType());
        documentResponse.setContent(document.getContent());
        documentResponse.setStatus(document.getStatus());

        WriterRequest writer = new WriterRequest();
        writer.setId(document.getWriteId());
        writer.setName(document.getWriterName());
        writer.setTeamName(document.getWriterTeam());
        writer.setPositionName(document.getWriterPosition());
        documentResponse.setWriter(writer);

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
        documentResponse.setApprovers(approverRequests);

        return documentResponse;
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
           /* if(approverRequest.getApprovalOrder() == 1) {
                approvalLine.setStatus(APPROVALSTATUS.PENDING);
            }*/
            approvalLines.add(approvalLine);
        }
        document.setApprovalLines(approvalLines);
        document.setCreateAt(LocalDateTime.now());
        document.setStatus(DOCUMENTSTATUS.DRAFT); //내 글 수정도 해야하니까 일단 저장해놓음 나의 문서에서 결재를 누르면 INPROGRESS로 바꿈

        return document;
    }

    public Document dtoToEntity(DocumentResponse response){
        Document document = new Document();
        document.setId(response.getId());
        document.setTitle(response.getTitle());
        document.setType(response.getTemplateType());
        document.setContent(response.getContent());
        document.setWriteId(response.getWriter().getId());
        document.setWriterName(response.getWriter().getName());
        document.setWriterTeam(response.getWriter().getTeamName());
        document.setWriterPosition(response.getWriter().getPositionName());

        //나중에 직책이나 팀 변하면 같이 변해는게 아니고 로그처럼 남아있어야해서
        List<ApprovalLine> approvalLines = new ArrayList<>();
        for(ApproverRequest approverRequest: response.getApprovers()){
            ApprovalLine approvalLine = new ApprovalLine();
            approvalLine.setUserId(approverRequest.getUserId());
            approvalLine.setName(approverRequest.getName());
            approvalLine.setTeamName(approverRequest.getTeamName());
            approvalLine.setPositionName(approverRequest.getPositionName());
            approvalLine.setDocument(document);
            approvalLine.setApprovalOrder(approverRequest.getApprovalOrder());
           /* if(approverRequest.getApprovalOrder() == 1) {
                approvalLine.setStatus(APPROVALSTATUS.PENDING);
            }*/
            approvalLines.add(approvalLine);
        }
        document.setApprovalLines(approvalLines);
        document.setCreateAt(LocalDateTime.now());
        document.setStatus(DOCUMENTSTATUS.DRAFT); //내 글 수정도 해야하니까 일단 저장해놓음 나의 문서에서 결재를 누르면 INPROGRESS로 바꿈

        return document;
    }


}
