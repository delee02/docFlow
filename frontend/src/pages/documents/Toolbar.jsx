import React, { useState } from "react";
import { GoBold, GoItalic, GoStrikethrough, GoListOrdered } from "react-icons/go";
import { MdFormatListBulleted, MdOutlineFormatColorText } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import { LuImagePlus, LuUndo2, LuRedo2, LuAlignCenter, LuAlignLeft, LuAlignRight } from "react-icons/lu";
import { CiViewTable } from "react-icons/ci";

const Toolbar = ({ editor, showTablePicker, setShowTablePicker }) => {
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
      isActive: () => editor.isActive("link"),
    },
    {
      label: <LuImagePlus />,
      command: () => {
        const url = window.prompt("이미지 URL을 입력하세요");
        if (url) editor.chain().focus().setImage({ src: url }).run();
      },
      isActive: () => false,
    },
    {
      label: <LuUndo2 />,
      command: () => editor.chain().focus().undo().run(),
      isActive: () => false,
      disabled: () => !editor.can().undo(),
    },
    {
      label: <LuRedo2 />,
      command: () => editor.chain().focus().redo().run(),
      isActive: () => false,
      disabled: () => !editor.can().redo(),
    },
    {
      label: <LuAlignLeft />,
      command: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: () => editor.isActive({ textAlign: "left" }),
      disabled: () => !editor.can().setTextAlign("left"),
    },
    {
      label: <LuAlignCenter />,
      command: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: () => editor.isActive({ textAlign: "center" }),
      disabled: () => !editor.can().setTextAlign("center"),
    },
    {
      label: <LuAlignRight />,
      command: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: () => editor.isActive({ textAlign: "right" }),
      disabled: () => !editor.can().setTextAlign("right"),
    },
    {
      label: <CiViewTable />,
      command: () => setShowTablePicker(prev => !prev),
      isActive: () => false,
    },
  ];

  // 테이블 사이즈 픽커 컴포넌트도 여기서 분리 가능하지만,
  // 별도 컴포넌트로 분리하는 걸 권장합니다.
  // 여기서는 툴바 버튼만 렌더링

  return (
    <div style={{ display: "flex", gap: 1, flexWrap: "wrap", marginBottom: 20 }}>
      {toolbarButtons.map(({ label, command, isActive, disabled }, idx) => {
        const active = isActive?.();
        const isDisabled = disabled?.();

        return (
          <button
            key={idx}
            onClick={command}
            disabled={isDisabled}
            style={{
              fontWeight: active ? "bold" : "normal",
              padding: "6px 12px",
              fontSize: 16,
              marginRight: 1,
              cursor: isDisabled ? "not-allowed" : "pointer",
              borderRadius: 4,
              border: "1px solid #ccc",
              backgroundColor: active ? "#454f7cff" : "#fff",
              color: active ? "#fff" : "#000000ff",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default Toolbar;
