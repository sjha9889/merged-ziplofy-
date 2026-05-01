import {
  ArrowsRightLeftIcon,
  ChevronDownIcon,
  CodeBracketIcon,
  ListBulletIcon,
  NumberedListIcon,
} from "@heroicons/react/24/outline";
import CharacterCount from "@tiptap/extension-character-count";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import React, { useEffect, useRef, useState } from "react";

interface ProductDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ProductDescriptionInput: React.FC<ProductDescriptionInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Describe your product..."
}) => {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value || "");
  const [isAlignMenuOpen, setIsAlignMenuOpen] = useState(false);
  const [isListMenuOpen, setIsListMenuOpen] = useState(false);
  const alignMenuRef = useRef<HTMLDivElement | null>(null);
  const listMenuRef = useRef<HTMLDivElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      TaskList,
      TaskItem.configure({ nested: true }),
      HorizontalRule,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CharacterCount,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "min-h-[180px] max-w-none focus:outline-none px-4 py-3 text-sm text-gray-900 leading-6 [&_p]:my-2 [&_h1]:my-3 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight [&_h2]:my-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-snug [&_h3]:my-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-snug [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:text-gray-700 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-gray-900 [&_pre]:p-3 [&_pre]:text-gray-100 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const incoming = value || "";
    const current = editor.getHTML();
    if (incoming !== current) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    if (!isHtmlMode) {
      setHtmlValue(value || "");
    }
  }, [value, isHtmlMode]);

  useEffect(() => {
    if (!isAlignMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        alignMenuRef.current &&
        !alignMenuRef.current.contains(event.target as Node)
      ) {
        setIsAlignMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAlignMenuOpen]);

  useEffect(() => {
    if (!isListMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        listMenuRef.current &&
        !listMenuRef.current.contains(event.target as Node)
      ) {
        setIsListMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isListMenuOpen]);

  const setOrUnsetLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl || "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const ToolbarButton = ({
    label,
    active,
    onClick,
    disabled = false,
    title,
  }: {
    label: string;
    active?: boolean;
    onClick: () => void;
    disabled?: boolean;
    title?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-2.5 py-1.5 text-xs font-medium rounded border transition-colors ${
        active
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );

  const ToolbarDivider = () => <div className="w-px h-6 bg-gray-200 mx-0.5" />;

  const setTextAlign = (alignment: "left" | "center" | "right" | "justify") => {
    editor?.chain().focus().setTextAlign(alignment).run();
    setIsAlignMenuOpen(false);
  };

  const applyTextColor = (color: string) => {
    editor?.chain().focus().setColor(color).run();
  };

  const applyBackgroundColor = (color: string) => {
    editor?.chain().focus().setHighlight({ color }).run();
  };

  const getAlignment = (): "left" | "center" | "right" | "justify" => {
    if (editor?.isActive({ textAlign: "center" })) return "center";
    if (editor?.isActive({ textAlign: "right" })) return "right";
    if (editor?.isActive({ textAlign: "justify" })) return "justify";
    return "left";
  };

  const alignment = getAlignment();
  const listType = editor?.isActive("orderedList") ? "ordered" : "bullet";
  const handleToggleHtmlMode = () => {
    if (!isHtmlMode) {
      setHtmlValue(editor?.getHTML() || value || "");
      setIsHtmlMode(true);
      return;
    }
    const next = htmlValue || "";
    onChange(next);
    if (editor) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
    setIsHtmlMode(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Description
      </label>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-200 bg-gray-50 px-3 py-2">
          <ToolbarButton
            label="B"
            active={editor?.isActive("bold")}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor?.can().chain().focus().toggleBold().run()}
            title="Bold (Ctrl/Cmd+B)"
          />
          <ToolbarButton
            label="I"
            active={editor?.isActive("italic")}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor?.can().chain().focus().toggleItalic().run()}
            title="Italic (Ctrl/Cmd+I)"
          />
          <ToolbarButton
            label="U"
            active={editor?.isActive("underline")}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            title="Underline (Ctrl/Cmd+U)"
          />
          <ToolbarButton
            label="S"
            active={editor?.isActive("strike")}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          />
          <ToolbarButton
            label="H"
            active={editor?.isActive("highlight")}
            onClick={() => editor?.chain().focus().toggleHighlight().run()}
            title="Highlight"
          />
          <label
            className="inline-flex cursor-pointer items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            title="Text color"
          >
            <span className="text-sm font-semibold">A</span>
            <input
              type="color"
              value={(editor?.getAttributes("textStyle").color as string) || "#111827"}
              onChange={(e) => applyTextColor(e.target.value)}
              className="h-4 w-4 cursor-pointer rounded border-0 bg-transparent p-0"
            />
          </label>
          <label
            className="inline-flex cursor-pointer items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            title="Background color"
          >
            <span className="inline-block h-3.5 w-3.5 rounded border border-gray-300 bg-yellow-200" />
            <input
              type="color"
              value={(editor?.getAttributes("highlight").color as string) || "#fef08a"}
              onChange={(e) => applyBackgroundColor(e.target.value)}
              className="h-4 w-4 cursor-pointer rounded border-0 bg-transparent p-0"
            />
          </label>
          <ToolbarDivider />
          <ToolbarButton
            label="P"
            active={editor?.isActive("paragraph")}
            onClick={() => editor?.chain().focus().setParagraph().run()}
            title="Paragraph"
          />
          <ToolbarButton
            label="H1"
            active={editor?.isActive("heading", { level: 1 })}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            title="Heading 1"
          />
          <ToolbarButton
            label="H2"
            active={editor?.isActive("heading", { level: 2 })}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Heading 2"
          />
          <ToolbarButton
            label="H3"
            active={editor?.isActive("heading", { level: 3 })}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Heading 3"
          />
          <ToolbarDivider />
          <div className="relative" ref={alignMenuRef}>
            <button
              type="button"
              onClick={() => setIsAlignMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 rounded border border-gray-200 bg-white px-2.5 py-1.5 text-gray-700 transition-colors hover:bg-gray-50"
              title="Text alignment"
            >
              <ListBulletIcon className="h-4 w-4" />
              <ChevronDownIcon className="h-3.5 w-3.5" />
            </button>
            {isAlignMenuOpen ? (
              <div className="absolute left-0 z-20 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                <button
                  type="button"
                  onClick={() => setTextAlign("left")}
                  className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm ${
                    alignment === "left" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-mono text-xs">L</span>
                  Left
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign("center")}
                  className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm ${
                    alignment === "center" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-mono text-xs">C</span>
                  Center
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign("right")}
                  className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm ${
                    alignment === "right" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-mono text-xs">R</span>
                  Right
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign("justify")}
                  className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm ${
                    alignment === "justify" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-mono text-xs">J</span>
                  Justify
                </button>
              </div>
            ) : null}
          </div>
          <ToolbarDivider />
          <div className="relative" ref={listMenuRef}>
            <button
              type="button"
              onClick={() => setIsListMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 rounded border border-gray-200 bg-white px-2.5 py-1.5 text-gray-700 transition-colors hover:bg-gray-50"
              title="List type"
            >
              <span className="text-xs font-medium">{listType === "ordered" ? "1." : "•"}</span>
              <ChevronDownIcon className="h-3.5 w-3.5" />
            </button>
            {isListMenuOpen ? (
              <div className="absolute left-0 z-20 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().toggleBulletList().run();
                    setIsListMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm ${
                    editor?.isActive("bulletList")
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xs font-medium">•</span>
                  Bulleted list
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().toggleOrderedList().run();
                    setIsListMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm ${
                    editor?.isActive("orderedList")
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xs font-medium">1.</span>
                  Numbered list
                </button>
              </div>
            ) : null}
          </div>
          <ToolbarButton
            label="Quote"
            active={editor?.isActive("blockquote")}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            title="Blockquote"
          />
          <ToolbarDivider />
          <ToolbarButton
            label="`"
            active={editor?.isActive("code")}
            onClick={() => editor?.chain().focus().toggleCode().run()}
            title="Inline code"
          />
          <ToolbarButton
            label="{ }"
            active={editor?.isActive("codeBlock")}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            title="Code block"
          />
          <ToolbarButton
            label="Sup"
            active={editor?.isActive("superscript")}
            onClick={() => editor?.chain().focus().toggleSuperscript().run()}
            title="Superscript"
          />
          <ToolbarButton
            label="Sub"
            active={editor?.isActive("subscript")}
            onClick={() => editor?.chain().focus().toggleSubscript().run()}
            title="Subscript"
          />
          <ToolbarButton
            label="HR"
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            title="Horizontal rule"
          />
          <ToolbarDivider />
          <ToolbarButton
            label="Link"
            active={editor?.isActive("link")}
            onClick={setOrUnsetLink}
            title="Insert/edit link"
          />
          <ToolbarButton
            label="Unlink"
            onClick={() => editor?.chain().focus().unsetLink().run()}
            title="Remove link"
          />
          <ToolbarButton
            label="Clear"
            onClick={() =>
              editor?.chain().focus().clearNodes().unsetAllMarks().run()
            }
            title="Clear formatting"
          />
          <ToolbarDivider />
          <ToolbarButton
            label="Undo"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().chain().focus().undo().run()}
            title="Undo (Ctrl/Cmd+Z)"
          />
          <ToolbarButton
            label="Redo"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().chain().focus().redo().run()}
            title="Redo (Ctrl/Cmd+Shift+Z)"
          />
          <div className="ml-auto">
            <button
              type="button"
              onClick={handleToggleHtmlMode}
              className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                isHtmlMode
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
              title="Toggle rich text and HTML"
            >
              <ArrowsRightLeftIcon className="h-3.5 w-3.5" />
              {isHtmlMode ? "Rich text" : "HTML"}
            </button>
          </div>
        </div>
        <div className="max-h-[460px] overflow-y-auto">
          {isHtmlMode ? (
            <textarea
              value={htmlValue}
              onChange={(e) => {
                setHtmlValue(e.target.value);
                onChange(e.target.value);
              }}
              className="min-h-[180px] w-full resize-y border-0 px-4 py-3 font-mono text-sm text-gray-900 outline-none"
              spellCheck={false}
            />
          ) : (
            <EditorContent editor={editor} />
          )}
        </div>
        <div className="border-t border-gray-200 px-3 py-2 text-xs text-gray-500 flex items-center justify-between bg-gray-50">
          <span className="inline-flex items-center gap-1">
            <ListBulletIcon className="w-3.5 h-3.5" />
            Rich formatting + markdown shortcuts
          </span>
          <span className="inline-flex items-center gap-2">
            <NumberedListIcon className="w-3.5 h-3.5" />
            {editor?.storage.characterCount.words() || 0} words
            <CodeBracketIcon className="w-3.5 h-3.5" />
            {editor?.storage.characterCount.characters() || 0} chars
          </span>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Supports markdown-style shortcuts like <code>**bold**</code>,{" "}
        <code># heading</code>, <code>- list</code>, and <code>---</code> for divider.
      </p>
    </div>
  );
};

export default ProductDescriptionInput;

