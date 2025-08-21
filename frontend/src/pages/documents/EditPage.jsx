import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import FileAttachment from "../FileAttachment";
import '../../App.css';
import ApprovalLine from './ApprovalLine';
import api from '../../api/api';
import { templates } from './js/template.js';
import {saveDocument} from './js/saveDocument.js'
import { useDocumentAutoSave } from "./js/useDocumentAutoSave";
import { restoreDraft, fetchRedisDraft, fetchDBDraft } from "../../util/draftUtil";
import { useQuery } from '@tanstack/react-query';
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Mention from '@tiptap/extension-mention';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';

import { MdFormatListBulleted, MdOutlineFormatColorText } from 'react-icons/md';
import { GoBold, GoItalic, GoStrikethrough, GoListOrdered } from "react-icons/go";
import { FiExternalLink } from "react-icons/fi";
import { LuImagePlus, LuUndo2, LuRedo2, LuAlignCenter, LuAlignLeft, LuAlignRight } from "react-icons/lu";
import { CiViewTable } from "react-icons/ci";
import { SketchPicker } from "react-color";

const EditPage = () => {
  const navigate = useNavigate();
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  const [title, setTitle] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [color, setColor] = useState("#ffffffff");
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [documentId, setDocumentId] = useState('');
  const [draftLoaded, setDraftLoaded] = useState(false);

  // 멘션 관련
  const [open, setOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [coords, setCoords] = useState({ left: 0, top: 0 });

  // 멘션 캐시 없을 때 api
  const fetchUsers = () => api.get('/user/list').then(res => res.data);

  //멘션  react query로 캐싱
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
      Link.configure({ openOnClick: true }),
      Image,
      Mention.configure({
        HTMLAttributes: { class: 'mention' },
        suggestion: {
          char: '@',
          startOfLine: false,
          items: ({ query }) => {
            if (!query || query.trim() === '') return [];
            return users.filter(user => user.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
          },
          render: () => ({}),
        },
      }),
      Heading,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({ placeholder: '문서를 작성하세요' }),
    ],
    onUpdate: ({ editor }) => {
      const { state, view } = editor;
      const { selection } = state;
      const { from } = selection;
      const textBefore = state.doc.textBetween(Math.max(0, from - 20), from, null, '\ufffc');
      const match = /@([ㄱ-ㅎ가-힣a-zA-Z0-9_]*)$/.exec(textBefore);

      if (match) {
        const query = match[1];
        if (!query || query.trim() === '') {
          setOpen(false);
          return;
        }

        const filtered = users.filter(user => user.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
        if (filtered.length > 0) {
          setFilteredUsers(filtered);
          if (!open) {
            setSelectedIndex(0);
            setOpen(true);
          }
          const coords = view.coordsAtPos(from);
          setCoords({ left: coords.left, top: coords.bottom });
          return;
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
    {
      label: <FiExternalLink />,
      command: () => {
        const url = window.prompt("링크 URL을 입력하세요");
        if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
      },
      isActive: () => editor.isActive("link")
    },
    {
      label: <LuImagePlus />,
      command: () => {
        const url = window.prompt("이미지 URL을 입력하세요");
        if (url) editor.chain().focus().setImage({ src: url }).run();
      },
      isActive: () => false,
    },
    { label: <LuUndo2 />, command: () => editor.chain().focus().undo().run(), isActive: () => false, disabled: () => !editor.can().undo() },
    { label: <LuRedo2 />, command: () => editor.chain().focus().redo().run(), isActive: () => false, disabled: () => !editor.can().redo() },
    { label: <LuAlignLeft />, command: () => editor.chain().focus().setTextAlign('left').run(), isActive: () => editor.isActive({ textAlign: 'left' }), disabled: () => !editor.can().setTextAlign('left') },
    { label: <LuAlignCenter />, command: () => editor.chain().focus().setTextAlign('center').run(), isActive: () => editor.isActive({ textAlign: 'center' }), disabled: () => !editor.can().setTextAlign('center') },
    { label: <LuAlignRight />, command: () => editor.chain().focus().setTextAlign('right').run(), isActive: () => editor.isActive({ textAlign: 'right' }), disabled: () => !editor.can().setTextAlign('right') },
    { label: <CiViewTable />, command: () => setShowTablePicker(prev => !prev), isActive: () => false },
  ];

  const TableSizePicker = ({ onSelect }) => {
    const [hovered, setHovered] = useState({ rows: 0, cols: 0 });
    const maxSize = 10;
    const cells = [];
    for (let r = 1; r <= maxSize; r++) {
      for (let c = 1; c <= maxSize; c++) {
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
        );
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
  };

  const insertTable = (rows, cols) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setShowTablePicker(false);
  };

  const [writer, setWriter] = useState({ team: '-', position: '-', name: '-' });
  const [approvers, setApprovers] = useState([]);
  const { docId } = useParams();
  const [status, setStatus] =useState([]);


  // 자동 저장
  useDocumentAutoSave({ documentId: docId ? docId : "", writer, title, templateType: selectedTemplateId, approvers, editor });


  const applyDraftData = (data) => {
    if (!data) return;
    setTitle(data.title);
    setSelectedTemplateId(data.templateType);
    setApprovers(data.approvers);
    setStatus(data.status);
    setWriter(data.writer);
    if (editor) editor.commands.setContent(data.content);
    setDraftLoaded(true);
  };
  //저장된 내문서 가져와서 수정할 때
  useEffect(() => {
    if (!editor || draftLoaded) return;

    const loadDraft = async () => {
      //DB
      if (docId) {
        const dbData = await fetchDBDraft(docId);
        if (dbData) return applyDraftData(dbData);
      }else{
        //로컬 캐시
        const savedDraft = writer?.id ? restoreDraft(writer.id) : null;
        if (savedDraft) return applyDraftData(savedDraft);

        //Redis
        const redisDraft = await fetchRedisDraft();
        if (redisDraft) applyDraftData(redisDraft);
        };
      }

    loadDraft();
  }, [docId, editor, writer, draftLoaded]);


  
  const selectUserByIndex = (index) => {
    const user = filteredUsers[index];
    if (!editor || !user) return;
    const { state } = editor;
    const { selection } = state;
    const { from } = selection;
    const textBefore = state.doc.textBetween(from - 20, from, null, '\ufffc');
    const match = /@([ㄱ-ㅎ가-힣a-zA-Z0-9_]*)$/.exec(textBefore);

    if (match) {
      const startPos = from - match[0].length - 2;
      editor.chain().focus().deleteRange({ from: startPos, to: from }).insertContentAt(startPos, {
        type: 'mention',
        attrs: { id: user.userId, label: user.name },
      }).setTextSelection(startPos + user.name.length + 3).run();
    }
    setOpen(false);
  };

  const onKeyDown = (event) => {
    if (!open) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredUsers.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredUsers.length) % filteredUsers.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      selectUserByIndex(selectedIndex);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!editor) return;
    const onUpdate = () => setRefresh(prev => prev + 1);
    editor.on('selectionUpdate', onUpdate);
    editor.on('transaction', onUpdate);
    return () => {
      editor.off('selectionUpdate', onUpdate);
      editor.off('transaction', onUpdate);
    };
  }, [editor]);

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) editor.commands.setContent(template.content, false);
  };

  const handleTitleChange = (e) => setTitle(e.target.value);
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
          <ApprovalLine
            approvalFlow={selectedTemplate?.approvalFlow || []}
            approvers={approvers}
            setApprovers={setApprovers}
            writer={writer}
            setWriter={setWriter}
            users={users}
          />

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <input type="text" placeholder="문서 제목을 입력하세요" value={title} onChange={handleTitleChange} style={styles.input} />
            <select value={selectedTemplateId} onChange={handleTemplateChange} style={styles.select}>
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button
              style={styles.saveButton}
              onClick={() => saveDocument({
                editor,
                docId,
                title,
                selectedTemplateId,
                writer,
                approvers,
                navigate
              })}
            >
              저장
            </button>
          </div>

          <div style={{ display: "flex", gap: 1, flexWrap: 'wrap', marginBottom: '20px' }}>
            {toolbarButtons.map(({ label, command, isActive, disabled }, idx) => (
              <button key={idx} onClick={command} disabled={disabled?.()} style={styles.toolbarButton(isActive?.())}>{label}</button>
            ))}

            {showTablePicker && <TableSizePicker onSelect={insertTable} />}

            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button style={{ fontWeight: 'normal', padding: '6px 12px', fontSize: 16, marginRight: 1, cursor: 'pointer', borderRadius: 4, border: '1px solid #ccc', backgroundColor: '#fff', color: '#000000ff' }} onClick={() => setShowPicker(!showPicker)}>
                <MdOutlineFormatColorText />
              </button>
              {showPicker && (
                <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1000 }}>
                  <SketchPicker color={color} onChangeComplete={(c) => { const hex = c.hex; setColor(hex); editor.chain().focus().setColor(hex).run(); }} />
                </div>
              )}
            </div>

            <select style={{ border: '1px solid #ccc', borderRadius: '4px' }} onChange={(e) => { const level = parseInt(e.target.value); editor.chain().focus().toggleHeading({ level }).run(); }} value={editor.isActive('heading', { level: 1 }) ? 1 : editor.isActive('heading', { level: 2 }) ? 2 : editor.isActive('heading', { level: 3 }) ? 3 : ''}>
              <option value="">글자크기</option>
              <option value="1">H1</option>
              <option value="2">H2</option>
              <option value="3">H3</option>
            </select>
          </div>

          <div className="table-resizable" style={styles.editorBox}>
            <EditorContent editor={editor} onKeyDown={onKeyDown} />

            {open && (
              <div style={{ position: 'absolute', left: coords.left, top: coords.top + window.scrollY, backgroundColor: 'white', border: '1px solid #ddd', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 1000, width: 200 }}>
                {filteredUsers.map((user, i) => (
                  <div key={user.userId} onClick={() => selectUserByIndex(i)} onMouseEnter={() => setSelectedIndex(i)} style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: i === selectedIndex ? '#bde4ff' : 'transparent' }}>
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
  wrapper: { display: "flex", height: "100vh" },
  main: { flex: 1, padding: "30px", backgroundColor: "#f0f2f5", display: "flex", justifyContent: "center", alignItems: "flex-start" },
  editorContainer: { backgroundColor: "#fff", borderRadius: 8, padding: 30, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "100%", maxWidth: 1200, minHeight: "100vh", display: "flex", flexDirection: "column" },
  input: { width: "70%", fontSize: 18, padding: "8px 12px", marginBottom: 20, borderRadius: 4, border: "1px solid #ccc", boxSizing: "border-box" },
  select: { width: "7%", flex: 1, marginRight: 8, marginLeft: 8, padding: "8px 12px", fontSize: 16, marginBottom: 20, borderRadius: 4, border: "1px solid #ccc" },
  saveButton: { padding: "8px 16px", fontSize: 16, borderRadius: 4, border: "none", backgroundColor: "#454f7cff", color: "#fff", cursor: "pointer", marginBottom: 20 },
  toolbarButton: (isActive) => ({ fontWeight: isActive ? 'bold' : 'normal', padding: '6px 12px', fontSize: 16, marginRight: 1, cursor: 'pointer', borderRadius: 4, border: '1px solid #ccc', backgroundColor: isActive ? '#454f7cff' : '#fff', color: isActive ? '#fff' : '#000000ff' }),
  editorBox: { flex: 1, border: "1px solid #ccc", borderRadius: 6, backgroundColor: "#fff", padding: 15, fontSize: 16, lineHeight: 1.6, overflowY: "auto" },
};

export default EditPage;
