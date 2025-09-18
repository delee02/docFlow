export const templates = [
  {
    id: 'doc',
    name: '양식 선택',
    content: ``,
    approvalFlow: [
    ],
  },
  {
    id: 'vacation',
    name: '휴가 신청서',
    content: `<div style="display: flex; flex-direction: column; gap: 12px; max-width: 600px;">
                    <div>
                        <strong>휴가종류:</strong>
                        <span contenteditable="true" style="margin-left: 8px; padding: 4px; border: 1px solid #ccc; min-width: 120px; display: inline-block;">연차, 반차 등 입력</span>
                    </div>
                    <div>
                        <strong>휴가기간:</strong>
                        <span contenteditable="true" style="margin-left: 8px; padding: 4px; border: 1px solid #ccc; min-width: 200px; display: inline-block;">예) 2025-08-12 ~ 2025-08-15</span>
                    </div>
                    <div>
                        <strong>사유:</strong>
                        <span contenteditable="true" style="margin-left: 8px; padding: 4px; border: 1px solid #ccc; min-width: 300px; display: inline-block;">사유 입력</span>
                    </div>
                    <div>
                        <strong>비고:</strong>
                        <span contenteditable="true" style="margin-left: 8px; padding: 4px; border: 1px solid #ccc; min-width: 300px; display: inline-block;">비고 입력</span>
                    </div>
                </div>`,
    approvalFlow: [
      { positionName: '팀장', level: 3, hasDelegate: true },
      { positionName: '부장', level: 4, hasDelegate: false },
      { positionName: '임원', level: 5, hasDelegate: false },
    ],
  },
  {
    id: 'draft',
    name: '기안서',
    content: `<p>기안 내용을 입력하세요.</p>`,
    approvalFlow: [
      { positionName: '부장', level: 4, hasDelegate: false },
      { positionName: '임원', level: 5, hasDelegate: false },
    ],
  },
];
