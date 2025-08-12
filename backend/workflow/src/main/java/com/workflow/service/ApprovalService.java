package com.workflow.service;

import com.workflow.DTO.request.UserListRequest;
import com.workflow.constants.ROLE;
import com.workflow.entity.User;
import com.workflow.repository.ApprovalRepository;
import com.workflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ApprovalService {
    private final ApprovalRepository approvalRepository;
    private final UserRepository userRepository;

    //서류 해당 결재자 정보 가져오기
    public List<UserListRequest> getFlowByDoc (Long teamId, Long upperLevel){
        try {
            User manager = userRepository.findTop1ByTeam_TeamIdAndRole(teamId, ROLE.ROLE_MANAGER).orElseThrow(() -> new IllegalArgumentException("팀장없음"));
            User upper = userRepository.findTop1ByPosition_LevelAndTeam_TeamId(upperLevel, teamId).orElse(null);

            //List<User> users = userRepository.findByPosition_LevelInAndTeam_TeamIdOrderByPosition_LevelDesc(levelList, teamId);

            List<UserListRequest> approvalRequestList = new ArrayList<>();

            UserListRequest req = new UserListRequest();
            req.setUserId(manager.getUserId());
            req.setName(manager.getName());
            req.setTeamName(manager.getTeam().getTeamName());
            req.setPositionName(manager.getPosition().getPositionName());
            approvalRequestList.add(req);

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
}
