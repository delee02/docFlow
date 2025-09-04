package com.workflow.service;

import com.workflow.DTO.request.UserListRequest;
import com.workflow.constants.APPROVALSTATUS;
import com.workflow.constants.DOCUMENTSTATUS;
import com.workflow.constants.ROLE;
import com.workflow.entity.ApprovalLine;
import com.workflow.entity.Document;
import com.workflow.entity.User;
import com.workflow.repository.ApprovalRepository;
import com.workflow.repository.DocumentRepository;
import com.workflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ApprovalService {
    private final ApprovalRepository approvalRepository;
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;

    //서류 해당 결재자 정보 가져오기
    public List<UserListRequest> getFlowByDoc (Long teamId, Long upperLevel){
        try {
            User manager = userRepository.findTop1ByTeam_TeamIdAndRole(teamId, ROLE.ROLE_MANAGER).orElseThrow(() -> new IllegalArgumentException("팀장없음"));
            User upper = userRepository.findTop1ByPosition_LevelAndTeam_TeamId(upperLevel, teamId).orElse(null);

            //List<User> users = userRepository.findByPosition_LevelInAndTeam_TeamIdOrderByPosition_LevelDesc(levelList, teamId);

            List<UserListRequest> approvalRequestList = new ArrayList<>();

            //팀장
            UserListRequest req = new UserListRequest();
            req.setUserId(manager.getUserId());
            req.setName(manager.getName());
            req.setTeamName(manager.getTeam().getTeamName());
            req.setPositionName(manager.getPosition().getPositionName());
            approvalRequestList.add(req);

            //내 바로 위 사람 있음 가져가기
            if(upper !=null) {
                UserListRequest req1 = new UserListRequest();
                req1.setUserId(upper.getUserId());
                req1.setName(upper.getName());
                req1.setTeamName(upper.getTeam().getTeamName());
                req1.setPositionName(upper.getPosition().getPositionName());
                approvalRequestList.add(req1);
            }
            return approvalRequestList;
        }catch (Exception e) {
            System.out.println("결재자 가져오기 실패");
            e.printStackTrace();
            throw new RuntimeException("결재자 조회 중 오류 발생", e);
        }
    }

    public User getLevel (String email){
        return userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("레벨 가져오기 실패"));
    }

    public void approveDocument(Long userId, Long documentId) {
        Document document = documentRepository.findById(documentId).orElseThrow(() -> new NullPointerException("서류없음"));
        //가져온 유저아이디랑 서류아이디로 조회 approved로 바꾸고
        ApprovalLine approvalLine = approvalRepository.findByUserIdAndDocumentIdAndStatus(userId, documentId, APPROVALSTATUS.PENDING)
                .orElseThrow(() -> new IllegalStateException("유저 서류 pending인 상태 없음"));
        approvalLine.setStatus(APPROVALSTATUS.APPROVED);
        approvalLine.setApprovedAt(LocalDateTime.now());
        approvalRepository.save(approvalLine);

        // 해당서류에서 다음 사람 가져오기.(위에서 가져온 order+1로 조회하고,있으면 다음 단계 없으면 docstatus approved
        int nextOrder = approvalLine.getApprovalOrder() +1;
        ApprovalLine nextOne = approvalRepository.findByDocumentIdAndApprovalOrder(documentId, nextOrder)
                .orElse(null);

        //nextOne이 null이 아니면 상태 바꾸고, 없으면 서류 approved
        if(nextOne != null){
            nextOne.setStatus(APPROVALSTATUS.PENDING);
            //서버 docflow와 채팅방만들기(결재할 문서가 있을 떄 멘션됐을 때 알람이 이쪽으로 온다)
        }else{
            document.setStatus(DOCUMENTSTATUS.APPROVED);
            //결재 완료되면 기안자에게 알람발송
        }
    }
}
