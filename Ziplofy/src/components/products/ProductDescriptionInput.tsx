import {
  CodeBracketIcon,
  ListBulletIcon,
  NumberedListIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect } from "react";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { EditorContent, useEditor } from "@tiptap/react";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";

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
  const editor = useEditor({
    extensions: [
      StarterKit,
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
          "min-h-[180px] prose prose-sm max-w-none focus:outline-none px-4 py-3",
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
  }: {
    label: string;
    active?: boolean;
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
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
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Description
      </label>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex flex-wrap gap-1.5 border-b border-gray-200 bg-gray-50 px-3 py-2">
          <ToolbarButton
            label="B"
            active={editor?.isActive("bold")}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor?.can().chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            label="I"
            active={editor?.isActive("italic")}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor?.can().chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            label="U"
            active={editor?.isActive("underline")}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          />
          <ToolbarButton
            label="S"
            active={editor?.isActive("strike")}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          />
          <ToolbarButton
            label="H"
            active={editor?.isActive("highlight")}
            onClick={() => editor?.chain().focus().toggleHighlight().run()}
          />
          <ToolbarDivider />
          <ToolbarButton
            label="P"
            active={editor?.isActive("paragraph")}
            onClick={() => editor?.chain().focus().setParagraph().run()}
          />
          <ToolbarButton
            label="H1"
            active={editor?.isActive("heading", { level: 1 })}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          />
          <ToolbarButton
            label="H2"
            active={editor?.isActive("heading", { level: 2 })}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          />
          <ToolbarButton
            label="H3"
            active={editor?.isActive("heading", { level: 3 })}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          />
          <ToolbarDivider />
          <ToolbarButton
            label="L"
            active={editor?.isActive({ textAlign: "left" })}
            onClick={() => setTextAlign("left")}
          />
          <ToolbarButton
            label="C"
            active={editor?.isActive({ textAlign: "center" })}
            onClick={() => setTextAlign("center")}
          />
          <ToolbarButton
            label="R"
            active={editor?.isActive({ textAlign: "right" })}
            onClick={() => setTextAlign("right")}
          />
          <ToolbarButton
            label="J"
            active={editor?.isActive({ textAlign: "justify" })}
            onClick={() => setTextAlign("justify")}
          />
          <ToolbarDivider />
          <ToolbarButton
            label="•"
            active={editor?.isActive("bulletList")}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            label="1."
            active={editor?.isActive("orderedList")}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          />
          <ToolbarButton
            label="Task"
            active={editor?.isActive("taskList")}
            onClick={() => editor?.chain().focus().toggleTaskList().run()}
          />
          <ToolbarButton
            label="Quote"
            active={editor?.isActive("blockquote")}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarDivider />
          <ToolbarButton
            label="`"
            active={editor?.isActive("code")}
            onClick={() => editor?.chain().focus().toggleCode().run()}
          />
          <ToolbarButton
            label="{ }"
            active={editor?.isActive("codeBlock")}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          />
          <ToolbarButton
            label="x^2"
            active={editor?.isActive("superscript")}
            onClick={() => editor?.chain().focus().toggleSuperscript().run()}
          />
          <ToolbarButton
            label="x_2"
            active={editor?.isActive("subscript")}
            onClick={() => editor?.chain().focus().toggleSubscript().run()}
          />
          <ToolbarButton
            label="HR"
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          />
          <ToolbarDivider />
          <ToolbarButton
            label="Link"
            active={editor?.isActive("link")}
            onClick={setOrUnsetLink}
          />
          <ToolbarButton
            label="Unlink"
            onClick={() => editor?.chain().focus().unsetLink().run()}
          />
          <ToolbarButton
            label="Clear"
            onClick={() =>
              editor?.chain().focus().clearNodes().unsetAllMarks().run()
            }
          />
          <ToolbarDivider />
          <ToolbarButton
            label="Undo"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().chain().focus().undo().run()}
          />
          <ToolbarButton
            label="Redo"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().chain().focus().redo().run()}
          />
        </div>
        <div className="max-h-[460px] overflow-y-auto">
          <EditorContent editor={editor} />
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

