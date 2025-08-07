import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Mention from '@tiptap/extension-mention';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import { FaBold } from 'react-icons/fa';

const templates = {
  기안서: '제목: \n\n 내용:\n\n 결재 요청',
  휴가신청서: '휴가종류: \n\n 기간: 2025-08-19~ 2025-08-25'
};

const EditPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [title, setTitle] = useState('');
  const [refresh, setRefresh] = useState(false);
  const toolbarButtons = [
        { label: <FaBold />, command: () => editor.chain().focus().toggleBold().run(), isActive: () => editor.isActive("bold") },
        { label: "I", command: () => editor.chain().focus().toggleItalic().run(), isActive: () => editor.isActive("italic") },
        { label: "S", command: () => editor.chain().focus().toggleStrike().run(), isActive: () => editor.isActive("strike") },
        { label: "Bullet", command: () => editor.chain().focus().toggleBulletList().run(), isActive: () => editor.isActive("bulletList") },
        { label: "Ordered", command: () => editor.chain().focus().toggleOrderedList().run(), isActive: () => editor.isActive("orderedList") },
    

        // 링크
        {
            label: "Link",
            command: () => {
            const url = window.prompt("링크 URL을 입력하세요");
            if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            },
            isActive: () => editor.isActive("link")
        },
        // 이미지
        {
            label: "Img",
            command: () => {
            const url = window.prompt("이미지 URL을 입력하세요");
            if (url) editor.chain().focus().setImage({ src: url }).run();
            },
            isActive: () => false,
        },
        // Undo/Redo
        {
            label: "Undo",
            command: () => editor.chain().focus().undo().run(),
            isActive: () => false,
            disabled: () => !editor.can().undo()
        },
        {
            label: "Redo",
            command: () => editor.chain().focus().redo().run(),
            isActive: () => false,
            disabled: () => !editor.can().redo()
        },
        // 정렬
        ...["left", "center", "right", "justify"].map(align => ({
            label: align.charAt(0).toUpperCase() + align.slice(1),
            command: () => editor.chain().focus().setTextAlign(align).run(),
            isActive: () => editor.isActive({ textAlign: align })
        })),
        
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

          <div style={{ display: "flex", gap: 1, flexWrap: 'wrap' }}>
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
            <select
            onChange={(e) => {
                const level = parseInt(e.target.value)
                editor.chain().focus().toggleHeading({ level }).run()
            }}
            value={editor.isActive('heading', { level: 1 }) ? 1 :
                    editor.isActive('heading', { level: 2 }) ? 2 :
                    editor.isActive('heading', { level: 3 }) ? 3 : ''}
            >
            <option value="">본문</option>
            <option value="1">제목 1 (H1)</option>
            <option value="2">제목 2 (H2)</option>
            <option value="3">제목 3 (H3)</option>
        </select>
            </div>

            <div style={styles.editorBox}>
                <EditorContent editor={editor} />
            </div>
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
    backgroundColor: "#007bff",
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
