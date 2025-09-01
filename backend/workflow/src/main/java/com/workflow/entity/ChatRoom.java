package com.workflow.entity;

import com.workflow.constants.ROOMTYPE;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "chat_room")
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @Enumerated(EnumType.STRING)
    private ROOMTYPE type;

    private Long createdBy;
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatRoomMember> members;

    @Column(unique = true, nullable = true)
    private String dmKey;
}
