package com.workflow.repository;

import com.workflow.constants.ROLE;
import com.workflow.entity.Team;
import com.workflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    //이메일로 사람찾기
    Optional<User> findByEmail(String email);

    //회원 존재하는지
    boolean existsByEmail(String email);

    //팀 내림차순 userList
    List<User> findAllByOrderByTeam_TeamNameAscPosition_LevelAsc();

    Optional<User> findTop1ByPosition_LevelAndTeam_TeamId(Long level,Long teamId);

    Optional<User> findTop1ByTeam_TeamIdAndRole(Long teamId, ROLE role);

}
