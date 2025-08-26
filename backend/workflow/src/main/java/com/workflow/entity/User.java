package com.workflow.entity;

import com.workflow.constants.ROLE;
import com.workflow.constants.USERSTATUS;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "user")
@Getter
@Setter
@ToString
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_id" , unique=true)
    private Long userId;

    @Column(name="password", nullable = false)
    private String password;

    @Column(name="name", nullable = false)
    private String name;

    @Column(name="email", nullable = false)
    private String email;

    @ManyToOne
    @JoinColumn(name="team_id")
    private Team team;

    @ManyToOne
    @JoinColumn(name="position_id")
    private Position position;

    @Enumerated(EnumType.STRING)
    @Column(name="role", nullable = false)
    private ROLE role;

    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable = false)
    private USERSTATUS status;

    @Column(name="sign_img_url")
    private String signImgUrl;

}
