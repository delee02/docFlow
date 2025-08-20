package com.workflow.DTO.response;

import com.workflow.constants.DOCUMENTSTATUS;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.core.annotation.AliasFor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocListResponse {
    private Long id;
    private String title;
    private DOCUMENTSTATUS status;
    private String templateType;
    private String userName;
}
//제목, 기안자이름, 진행상황,타입,id