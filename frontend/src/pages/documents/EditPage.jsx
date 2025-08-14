import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import FileAttachment from "../FileAttachment";
import '../../App.css';
import ApprovalLine from './ApprovalLine'
import api from '../../api/api';
import {restoreDraft} from '../documents/js/restoreDraft'
import {templates} from './js/template.js'
import { useDocumentAutoSave } from "./js/useDocumentAutoSave";
import { useQuery } from '@tanstack/react-query';
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Mention from '@tiptap/extension-mention';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import {Table} from '@tiptap/extension-table'
import {TableRow} from '@tiptap/extension-table-row'
import {TableCell} from '@tiptap/extension-table-cell'
import {TableHeader} from '@tiptap/extension-table-header'
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';

import { MdFormatListBulleted,MdOutlineFormatColorText} from 'react-icons/md';
import { GoBold, GoItalic, GoStrikethrough,GoListOrdered } from "react-icons/go";
import { FiExternalLink } from "react-icons/fi";
import { LuImagePlus, LuUndo2, LuRedo2, LuAlignCenter, LuAlignLeft, LuAlignRight} from "react-icons/lu";

import { CiViewTable } from "react-icons/ci";
import { SketchPicker } from "react-color";


const EditPage = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState('');  // 선택된 id 저장
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId); // 선택된 id로 템플릿 객체 찾기
  const [title, setTitle] = useState(''); //제목
  const [refresh, setRefresh] = useState(false); //버튼 눌리면 색바뀌게 하려고 
  const [showPicker, setShowPicker] = useState(false); //글자 색 팔레트 
  const [color, setColor] =useState("#ffffffff") // 색 저장
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [documentId , setDocumentId] = useState('');

  const [draftLoaded, setDraftLoaded] = useState(false);


  //멘션을 위한 추가
  const [open, setOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]); //자동완성 후보 리스트
  const [selectedIndex, setSelectedIndex] = useState(0); //자동완성 리스트에서 선택된 인덱스(키보드 이동용)
  const [coords, setCoords] = useState({left:0, top:0}); //자동완성 팝업 좌표
  
  //캐시 없을 때 api 
  const fetchUsers = () => api.get('/user/list').then(res => res.data);
  //react Query로 캐싱하기

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const editor = useEditor({
      extensions: [
          StarterKit,
          Link.configure({
          openOnClick: true,  // 클릭 시 새창 열기 여부
          }),
          Image,
          Mention.configure({
            HTMLAttributes: { class: 'mention' },
            suggestion: {
              char: '@',
              startOfLine: false,
              items: ({ query }) => {
                if (!query || query.trim() === '') {
                  return [] // 아무것도 입력 안했으면 목록 안 보여줌
                }
                return users
                  .filter(user => user.name.toLowerCase().includes(query.toLowerCase()))
                  .slice(0, 5);
              },
              render: () => {
                return {};
              },
            },
          }),
          Heading,
          TextAlign.configure({
          types: ['heading', 'paragraph'], 
          }),
          TextStyle,
          Color,
          Table.configure({ resizable: true }),
          TableRow,
          TableCell,
          TableHeader,
          Placeholder.configure({
            placeholder: '문서를 작성하세요',
          }),

      ],

      //멘션
      onUpdate:({ editor }) => {
          //에디터 내용이 바뀔때마다 실행
          const {state, view } = editor;
          const {selection} = state;
          const {from} = selection; //커서 위치

          const textBefore = state.doc.textBetween(Math.max(0, from - 20), from, null, '\ufffc');

          const match = /@([ㄱ-ㅎ가-힣a-zA-Z0-9_]*)$/.exec(textBefore);
          console.log('matcj', match);
          if(match){
            const query = match[1];

            if (!query || query.trim() === '') {
              setOpen(false);
              return;
            }
          
            const filtered = users.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase())).slice(0,5);

            if(filtered.length > 0) {
              setFilteredUsers(filtered);
              if (!open) {          // open이 닫혀있을 때만 초기화
                setSelectedIndex(0);
                setOpen(true);
            }

              const coords = view.coordsAtPos(from);
              setCoords({left:coords.left, top:coords.bottom});

              return; // 자동완성 열림 상태 유지
            }
        }

        setOpen(false);
      },
      content: '',
      
    });

  


  const toolbarButtons = [
        { label: <GoBold />, command: () => editor.chain().focus().toggleBold().run(), isActive: () => editor.isActive("bold") },
        { label: <GoItalic />, command: () => editor.chain().focus().toggleItalic().run(), isActive: () => editor.isActive("italic") },
        { label: <GoStrikethrough />, command: () => editor.chain().focus().toggleStrike().run(), isActive: () => editor.isActive("strike") },
        { label: <MdFormatListBulleted />, command: () => editor.chain().focus().toggleBulletList().run(), isActive: () => editor.isActive("bulletList") },
        { label: <GoListOrdered />, command: () => editor.chain().focus().toggleOrderedList().run(), isActive: () => editor.isActive("orderedList") },
        // 링크
        {
            label: <FiExternalLink />,
            command: () => {
            const url = window.prompt("링크 URL을 입력하세요");
            if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            },
            isActive: () => editor.isActive("link")
        },
        // 이미지
        {
            label: <LuImagePlus />,
            command: () => {
            const url = window.prompt("이미지 URL을 입력하세요");
            if (url) editor.chain().focus().setImage({ src: url }).run();
            },
            isActive: () => false,
        },
        // Undo/Redo
        {
            label: <LuUndo2 />,
            command: () => editor.chain().focus().undo().run(),
            isActive: () => false,
            disabled: () => !editor.can().undo()
        },
        {
            label: <LuRedo2 />,
            command: () => editor.chain().focus().redo().run(),
            isActive: () => false,
            disabled: () => !editor.can().redo()
        },
        {
            label: <LuAlignLeft />,
            command: () => editor.chain().focus().setTextAlign('left').run(),
            isActive: () => editor.isActive({ textAlign: 'left' }),
            disabled: () => !editor.can().setTextAlign('left'),
          },
          {
            label: <LuAlignCenter />,
            command: () => editor.chain().focus().setTextAlign('center').run(),
            isActive: () => editor.isActive({ textAlign: 'center' }),
            disabled: () => !editor.can().setTextAlign('center'),
          },
          {
            label: <LuAlignRight />,
            command: () => editor.chain().focus().setTextAlign('right').run(),
            isActive: () => editor.isActive({ textAlign: 'right' }),
            disabled: () => !editor.can().setTextAlign('right'),
          },
          {
            label : <CiViewTable />,
            command: () => setShowTablePicker(prev => !prev),
            isActive: () => false,
          },
     
    ];

    const TableSizePicker = ({onSelect}) => {
      const [hovered ,setHovered] = useState({rows:0, cols:0});
      const maxSize = 10;
      const cells = [];

      for(let r=1; r<=maxSize; r++){
        for(let c=1; c<=maxSize; c++){
          const isActive = r <= hovered.rows && c <= hovered.cols;
          cells.push(
            <div
              key={`${r}-${c}`}
              onMouseEnter={() => setHovered({ rows: r, cols: c })}
              onClick={() => onSelect(r, c)}
              style={{
                width: 20,
                height: 20,
                backgroundColor: isActive ? '#454f7cff' : '#f0f0f0',
                border: '1px solid #000000ff',
                margin: 1,
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            />
          )
        }
      }
      return (
        <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${maxSize}, 22px)`,
              gridTemplateRows: `repeat(${maxSize}, 22px)`,
              padding: 6,
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: 4,
              position: 'absolute',
              zIndex: 1000,
              userSelect: 'none'
            }}
          >
            {cells}
        </div>
      )
    }
    const insertTable = (rows, cols) => {
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
      setShowTablePicker(false);
    };

    

    const [writer ,setWriter] = useState({team: '-', position: '-', name: '-'});
    const [approvers, setApprovers] = useState([]);

    //자동 저장
    useDocumentAutoSave({
          documentId: documentId? documentId :"",
          writer,
          title,
          templateType : selectedTemplateId,
          approvers,
          editor,
      });

      //저장되어있는 문서 있음 가져오기. 다른거 초기화 전에 가져와야하기 때문에 앞에 넣음
      useEffect(() => {
        if (!writer?.id || !editor || draftLoaded) return;
        const savedDraft = restoreDraft(writer.id);
        if (savedDraft) {
            setTitle(savedDraft.title);
            setSelectedTemplateId(savedDraft.templateType);
            setApprovers(savedDraft.approvers);
            setWriter(savedDraft.writer);
            if (editor) {
                editor.commands.setContent(savedDraft.content);
            }
            setDraftLoaded(true);
        }
      }, [writer, editor, draftLoaded]);


    
    // 자동완성 아이템 클릭 or 엔터로 선택 시 실행
    const selectUserByIndex = (index) => {
      const user = filteredUsers[index];
      if (!editor) return;
      if (!user) return;

      const { state } = editor;
      const { selection } = state;
      const { from } = selection;

      const textBefore = state.doc.textBetween(from - 20, from, null, '\ufffc');
      console.log('textBefore:', textBefore);

      const match = /@([ㄱ-ㅎ가-힣a-zA-Z0-9_]*)$/.exec(textBefore);
      console.log('멘션 매치 결과:', match);

      if (match) {
        const startPos = from - match[0].length -2 ;
        console.log('삭제 범위:', startPos, from);  

        editor.chain()
          .focus()
          .deleteRange({ from: startPos, to: from })
          .insertContentAt(startPos, {
            type: 'mention',
            attrs: { id: user.userId, label: user.name },
          }) 
          .setTextSelection(startPos + user.name.length + 3)
          .run();

        console.log('멘션 삽입 완료');
      } else {
        console.log('매치 실패로 멘션 삽입 안함');
      }

      setOpen(false);
    };

  
    // 키보드 이벤트 처리 (화살표 위아래, 엔터, ESC)
    const onKeyDown = (event) => {
      console.log('window keydown:', event.key);
      if (!open) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredUsers.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredUsers.length) % filteredUsers.length);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        console.log('엔터 눌림, 선택 인덱스:', selectedIndex)
        selectUserByIndex(selectedIndex);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
  };

  

  useEffect(() => {
    if (!editor) return;

    const onUpdate = () => {
      setRefresh(prev => prev + 1);
    };

    editor.on('selectionUpdate', onUpdate);
    editor.on('transaction', onUpdate);

    return () => {
      editor.off('selectionUpdate', onUpdate);
      editor.off('transaction', onUpdate);
    };
  }, [editor]);

    //저장되어있는 폼 관련 함수
    const handleTemplateChange = (e) => {
      const templateId = e.target.value;
      setSelectedTemplateId(templateId);
      const template = templates.find(t => t.id === templateId);

      if (template) {
        // draft가 아직 로드되지 않았거나, 사용자가 강제로 템플릿 선택한 경우만 적용
        if (!draftLoaded) {
          editor.commands.setContent(template.content, false);
          // 결재라인도 필요하면 여기서 set 처리
        }
      }
    };

    const handleTitleChange = (e) => {
      setTitle(e.target.value);
    };

    const handleSave = () => {
      const html = editor?.getHTML();
      console.log('제목:', title);
      console.log('내용:', html);
    };

    //이미지 올리기 관련 함수
    const ImageUploadPreview = () => {
      const [image, setImage] = useState(null);

      //파일 선택하면 실행됨
      const handleFileChange = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result); 
        };
        if(file){
          reader.readAsDataURL(file);
        }
      };

      const handleInputChange = (e) => {
        const file = e.target.files[0];
        handleFileChange(file);
      };

      const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.file[0];
        handleFileChange(file);
      }
      
      const handleDragOver = (e) => {
        e.preventDefault();
      }
    }


    if (!editor) return <div>Editor loading...</div>;


    return (
      <div style={styles.wrapper}>
        <Sidebar />
        <main style={styles.main}>
          <div style={styles.editorContainer}>
            <h2>결재 문서 작성</h2>
            <ApprovalLine 
              approvalFlow={selectedTemplate?.approvalFlow || []}
              approvers={approvers}
              setApprovers={setApprovers}   // state를 prop으로 내려줌
              writer={writer}
              setWriter={setWriter}
              users = {users}
            />

            

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <input
              type="text"
              placeholder="문서 제목을 입력하세요"
              value={title}
              onChange={handleTitleChange}
              style={styles.input}
              />
              <select
                value={selectedTemplateId}
                onChange={handleTemplateChange}
                style={styles.select}
              >
                <option value="">양식 선택</option>
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <button
                onClick={handleSave}
                style={styles.saveButton}
              >
                저장
              </button>
            </div>

            <div style={{ display: "flex", gap: 1, flexWrap: 'wrap' , marginBottom: '20px'}}>
              {toolbarButtons.map(({ label, command, isActive, disabled }, idx) => {
                  const active = isActive?.();
                  const isDisabled = disabled?.();

                  return (
                      <button
                      key={idx}
                      onClick={command}
                      disabled={isDisabled}
                      style={styles.toolbarButton(active)}
                      >
                      {label}
                  </button>
                  );
              })}
              {showTablePicker && (
                <TableSizePicker onSelect={insertTable} />
              )}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button style={{fontWeight:'normal',
                      padding: '6px 12px',
                      fontSize: 16,
                      marginRight: 1,
                      cursor: 'pointer',
                      borderRadius: 4,
                      border: '1px solid #ccc',
                      backgroundColor: '#fff',
                      color:'#000000ff'}}onClick={() => setShowPicker(!showPicker)}>
                  <MdOutlineFormatColorText />
                </button>
                {showPicker && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      zIndex: 1000, // 툴바 위에 보이게
                    }}
                  >
                    <SketchPicker
                      color={color}
                      onChangeComplete={(c) => {
                        const hex = c.hex;
                        setColor(hex);
                        editor.chain().focus().setColor(hex).run();
                      }}
                    />
                  </div>
                )}
              </div>

              <select
                style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                onChange={(e) => {
                    const level = parseInt(e.target.value)
                    editor.chain().focus().toggleHeading({ level }).run()
                }}
                value={editor.isActive('heading', { level: 1 }) ? 1 :
                        editor.isActive('heading', { level: 2 }) ? 2 :
                        editor.isActive('heading', { level: 3 }) ? 3 : ''}
                >
                <option value="">글자크기</option>
                <option value="1">H1</option>
                <option value="2">H2</option>
                <option value="3">H3</option>
              </select>
            </div>
            

            <div className="table-resizable" style={styles.editorBox}>
              <EditorContent editor={editor} onKeyDown={onKeyDown}/>
              {/* 자동완성 팝업 */}
            {open && (
              <div
                style={{
                  position: 'absolute',
                  left: coords.left,
                  top: coords.top + window.scrollY,  // 스크롤 보정
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  width: 200,
                }}
              >
          {filteredUsers.map((user, i) => (
            <div
              key={user.userId}
              onClick={() => selectUserByIndex(i)}    // 클릭 시 멘션 삽입
              onMouseEnter={() => setSelectedIndex(i)} // 마우스 올리면 선택 이동
              style={{
                padding: '5px 10px',
                cursor: 'pointer',
                backgroundColor: i === selectedIndex ? '#bde4ff' : 'transparent', // 선택 강조
              }}
            >
              {user.name}
            </div>
          ))}
        </div>
      )}
            </div>
              <FileAttachment />
            </div>
        </main>
      </div>
          );
        };

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
  },
  main: {
    flex: 1,
    padding: "30px",
    backgroundColor: "#f0f2f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  editorContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 30,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 1200,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "70%",
    fontSize: 18,
    padding: "8px 12px",
    marginBottom: 20,
    borderRadius: 4,
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  select: {
    width: "7%",
    flex: 1,
    marginRight: 8,
    marginLeft: 8,
    padding: "8px 12px",
    fontSize: 16,
    marginBottom: 20,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  saveButton: {
    padding: "8px 16px",
    fontSize: 16,
    borderRadius: 4,
    border: "none",
    backgroundColor: "#454f7cff",
    color: "#fff",
    cursor: "pointer",
    marginBottom: 20,
  },
  toolbarButton: (isActive) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    padding: '6px 12px',
    fontSize: 16,
    marginRight: 1,
    cursor: 'pointer',
    borderRadius: 4,
    border: '1px solid #ccc',
    backgroundColor: isActive ? '#454f7cff' : '#fff',
    color: isActive ? '#fff' : '#000000ff',

  }),
  editorBox: {
    flex: 1,
    border: "1px solid #ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    padding: 15,
    fontSize: 16,
    lineHeight: 1.6,
    overflowY: "auto",
    
  },
  
};

export default EditPage;
