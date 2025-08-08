import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import FileAttachment from "../FileAttachment";
import { useEditor, EditorContent, isActive } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Mention from '@tiptap/extension-mention';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';

import { MdFormatListBulleted,MdOutlineFormatColorText} from 'react-icons/md';
import { GoBold, GoItalic, GoStrikethrough,GoListOrdered } from "react-icons/go";
import { FiExternalLink } from "react-icons/fi";
import { LuImagePlus, LuUndo2, LuRedo2, LuAlignCenter, LuAlignLeft, LuAlignRight} from "react-icons/lu";
import { SketchPicker } from "react-color";

const templates = {
  기안서: '제목: \n\n 내용:\n\n 결재 요청',
  휴가신청서: '휴가종류: \n\n 기간: 2025-08-19~ 2025-08-25'
};

const EditPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(''); //저장되어 있는 폼 있으면 가져오고 아님말고
  const [title, setTitle] = useState(''); //제목
  const [refresh, setRefresh] = useState(false); //버튼 눌리면 색바뀌게 하려고 
  const [showPicker, setShowPicker] = useState(false); //글자 색 팔레트 
  const [color, setColor] =useState("#ffffffff") // 색 저장

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
     
    ];
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
              // 멘션 자동완성 등 커스텀 설정 (필요하면 추가)
          },
          }),
          Heading,
          TextAlign.configure({
          types: ['heading', 'paragraph'], 
          }),
          TextStyle,
          Color,

      ],
      content: '<p>문서를 작성하세요</p>',
      
    });

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
      const value = e.target.value;
      setSelectedTemplate(value);

      if (value === '기안서') setTitle('기안서 제목');
      else if (value === '휴가신청서') setTitle('휴가신청서 제목');
      else setTitle('');

      if (editor && templates[value]) {
        editor.commands.setContent(templates[value].replace(/\n/g, '<br>'));
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

            <input
              type="text"
              placeholder="문서 제목을 입력하세요"
              value={title}
              onChange={handleTitleChange}
              style={styles.input}
            />

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <select
                value={selectedTemplate}
                onChange={handleTemplateChange}
                style={styles.select}
              >
                <option value="">양식 선택</option>
                {Object.keys(templates).map(tpl => (
                  <option key={tpl} value={tpl}>{tpl}</option>
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
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button style={{fontWeight:'normal',
                      padding: '6px 12px',
                      fontSize: 16,
                      marginRight: 1,
                      cursor: 'pointer',
                      borderRadius: 4,
                      border: '1px solid #ccc',
                      backgroundColor: '#fff',
                      color:'#000'}}onClick={() => setShowPicker(!showPicker)}>
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

              <div style={styles.editorBox}>
                  <EditorContent editor={editor} />
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
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "100%",
    fontSize: 18,
    padding: "8px 12px",
    marginBottom: 20,
    borderRadius: 4,
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  select: {
    flex: 1,
    marginRight: 12,
    padding: "8px 12px",
    fontSize: 16,
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
  },
  toolbarButton: (isActive) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    padding: '6px 12px',
    fontSize: 16,
    marginRight: 1,
    cursor: 'pointer',
    borderRadius: 4,
    border: '1px solid #ccc',
    backgroundColor: isActive ? '#0a0a0aff' : '#fff',
    color: isActive ? '#fff' : '#000'
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
  }
};

export default EditPage;
