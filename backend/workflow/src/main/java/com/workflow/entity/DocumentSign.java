package com.workflow.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="sign")
public class DocumentSign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="sign_id")
    private Long signId;

    @ManyToOne
    private User signer;

    @ManyToOne
    private Document document;

    @Column(name="digital_sign", columnDefinition = "TEXT")
    private String digitalSign;
}
