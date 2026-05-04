import {
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
  Bars3CenterLeftIcon,
  ChevronDownIcon,
  CodeBracketIcon,
  EllipsisHorizontalIcon,
  LinkIcon,
  ListBulletIcon,
  NumberedListIcon,
  PhotoIcon,
  PlayCircleIcon,
  SparklesIcon,
  TableCellsIcon,
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
import type { Editor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ProductDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ICON_BTN =
  "inline-flex h-8 min-w-[2rem] shrink-0 items-center justify-center rounded-md text-sm text-gray-700 transition-colors hover:bg-gray-200/70 disabled:cursor-not-allowed disabled:opacity-35";

const ICON_BTN_ACTIVE = "bg-gray-200/90 text-gray-900";

const DROPDOWN_BTN =
  "inline-flex h-8 max-w-[11rem] items-center gap-1 rounded-md px-2 text-sm text-gray-700 transition-colors hover:bg-gray-200/70";

const MENU_PANEL =
  "absolute left-0 z-30 mt-1 min-w-[13rem] rounded-lg border border-gray-200 bg-white py-1 shadow-lg";

const TEXT_PRESETS = [
  "#111827",
  "#b91c1c",
  "#c2410c",
  "#ca8a04",
  "#15803d",
  "#0369a1",
  "#1d4ed8",
  "#6d28d9",
];

const BG_PRESETS = [
  "transparent",
  "#fef9c3",
  "#ffedd5",
  "#fee2e2",
  "#dcfce7",
  "#e0f2fe",
  "#ede9fe",
  "#f3f4f6",
];

function getBlockLabel(editor: Editor | null): string {
  if (!editor) return "Paragraph";
  if (editor.isActive("heading", { level: 1 })) return "Heading 1";
  if (editor.isActive("heading", { level: 2 })) return "Heading 2";
  if (editor.isActive("heading", { level: 3 })) return "Heading 3";
  if (editor.isActive("heading", { level: 4 })) return "Heading 4";
  if (editor.isActive("heading", { level: 5 })) return "Heading 5";
  if (editor.isActive("heading", { level: 6 })) return "Heading 6";
  if (editor.isActive("blockquote")) return "Blockquote";
  return "Paragraph";
}

const ProductDescriptionInput: React.FC<ProductDescriptionInputProps> = ({
  value,
  onChange,
  placeholder = "Describe your product...",
}) => {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value || "");
  const [, setToolbarTick] = useState(0);
  const [isAlignMenuOpen, setIsAlignMenuOpen] = useState(false);
  const [isBlockMenuOpen, setIsBlockMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [colorTab, setColorTab] = useState<"text" | "background">("text");
  const alignMenuRef = useRef<HTMLDivElement | null>(null);
  const blockMenuRef = useRef<HTMLDivElement | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const colorMenuRef = useRef<HTMLDivElement | null>(null);

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
          "min-h-[220px] max-w-none px-4 py-3 text-sm leading-6 text-gray-900 focus:outline-none [&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:text-gray-700 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_h1]:my-3 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight [&_h2]:my-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-snug [&_h3]:my-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-snug [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-gray-900 [&_pre]:p-3 [&_pre]:text-gray-100 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const bump = () => setToolbarTick((n) => n + 1);
    editor.on("selectionUpdate", bump);
    editor.on("transaction", bump);
    return () => {
      editor.off("selectionUpdate", bump);
      editor.off("transaction", bump);
    };
  }, [editor]);

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

  const closeAllMenus = useCallback(() => {
    setIsAlignMenuOpen(false);
    setIsBlockMenuOpen(false);
    setIsMoreMenuOpen(false);
    setIsColorMenuOpen(false);
  }, []);

  useEffect(() => {
    if (!isAlignMenuOpen && !isBlockMenuOpen && !isMoreMenuOpen && !isColorMenuOpen)
      return;
    const handleClickOutside = (event: MouseEvent) => {
      const t = event.target as Node;
      if (alignMenuRef.current?.contains(t)) return;
      if (blockMenuRef.current?.contains(t)) return;
      if (moreMenuRef.current?.contains(t)) return;
      if (colorMenuRef.current?.contains(t)) return;
      closeAllMenus();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAlignMenuOpen, isBlockMenuOpen, isMoreMenuOpen, isColorMenuOpen, closeAllMenus]);

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

  const ToolbarDivider = () => (
    <div className="mx-1 hidden h-6 w-px shrink-0 bg-gray-200 sm:block" aria-hidden />
  );

  const setTextAlign = (alignment: "left" | "center" | "right" | "justify") => {
    editor?.chain().focus().setTextAlign(alignment).run();
    setIsAlignMenuOpen(false);
  };

  const applyTextColor = (color: string) => {
    editor?.chain().focus().setColor(color).run();
  };

  const applyBackgroundColor = (color: string) => {
    if (color === "transparent") {
      editor?.chain().focus().unsetHighlight().run();
      return;
    }
    editor?.chain().focus().setHighlight({ color }).run();
  };

  const getAlignment = (): "left" | "center" | "right" | "justify" => {
    if (editor?.isActive({ textAlign: "center" })) return "center";
    if (editor?.isActive({ textAlign: "right" })) return "right";
    if (editor?.isActive({ textAlign: "justify" })) return "justify";
    return "left";
  };

  const alignment = getAlignment();

  const setBlock = (kind: "paragraph" | "blockquote" | 1 | 2 | 3 | 4 | 5 | 6) => {
    if (!editor) return;
    if (kind === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else if (kind === "blockquote") {
      editor.chain().focus().toggleBlockquote().run();
    } else {
      editor.chain().focus().setHeading({ level: kind }).run();
    }
    setIsBlockMenuOpen(false);
  };

  const blockRow = (
    label: string,
    kind: "paragraph" | "blockquote" | 1 | 2 | 3 | 4 | 5 | 6
  ) => {
    const active = editor ? getBlockLabel(editor) === label : false;
    return (
      <button
        key={label}
        type="button"
        onClick={() => setBlock(kind)}
        className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
          active ? "bg-gray-100 font-medium text-gray-900" : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        {label}
        {active ? <span className="text-gray-500">✓</span> : <span />}
      </button>
    );
  };

  const handleToggleHtmlMode = () => {
    if (!isHtmlMode) {
      setHtmlValue(editor?.getHTML() || value || "");
      setIsHtmlMode(true);
      closeAllMenus();
      return;
    }
    const next = htmlValue || "";
    onChange(next);
    if (editor) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
    setIsHtmlMode(false);
  };

  const AlignIcon = () => {
    if (alignment === "center") return <Bars3CenterLeftIcon className="h-5 w-5" />;
    if (alignment === "right") return <Bars3BottomRightIcon className="h-5 w-5" />;
    return <Bars3BottomLeftIcon className="h-5 w-5" />;
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Description
      </label>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200/90 bg-gray-50/95 px-2 py-1.5">
          <button
            type="button"
            className={`${ICON_BTN} text-gray-400`}
            title="Assistant (coming soon)"
            disabled
          >
            <SparklesIcon className="h-5 w-5" aria-hidden />
          </button>

          <ToolbarDivider />

          <div className="relative" ref={blockMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsBlockMenuOpen((o) => !o);
                setIsAlignMenuOpen(false);
                setIsMoreMenuOpen(false);
                setIsColorMenuOpen(false);
              }}
              className={DROPDOWN_BTN}
              title="Text style"
            >
              <span className="truncate">{getBlockLabel(editor)}</span>
              <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
            </button>
            {isBlockMenuOpen && editor ? (
              <div className={`${MENU_PANEL} max-h-72 overflow-y-auto`}>
                {blockRow("Paragraph", "paragraph")}
                {([1, 2, 3, 4, 5, 6] as const).map((level) =>
                  blockRow(`Heading ${level}`, level)
                )}
                {blockRow("Blockquote", "blockquote")}
              </div>
            ) : null}
          </div>

          <ToolbarDivider />

          <button
            type="button"
            className={`${ICON_BTN} font-bold ${editor?.isActive("bold") ? ICON_BTN_ACTIVE : ""}`}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor?.can().chain().focus().toggleBold().run()}
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            className={`${ICON_BTN} italic ${editor?.isActive("italic") ? ICON_BTN_ACTIVE : ""}`}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor?.can().chain().focus().toggleItalic().run()}
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            className={`${ICON_BTN} underline ${editor?.isActive("underline") ? ICON_BTN_ACTIVE : ""}`}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            title="Underline"
          >
            U
          </button>

          <div className="relative" ref={colorMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsColorMenuOpen((o) => !o);
                setIsBlockMenuOpen(false);
                setIsAlignMenuOpen(false);
                setIsMoreMenuOpen(false);
              }}
              className={`${DROPDOWN_BTN} min-w-0 gap-0.5 px-1.5`}
              title="Text & highlight color"
            >
              <span className="text-sm font-semibold leading-none">A</span>
              <span
                className="h-1 w-4 rounded-sm"
                style={{
                  backgroundColor:
                    (editor?.getAttributes("textStyle").color as string) || "#111827",
                }}
              />
              <ChevronDownIcon className="h-4 w-4 text-gray-500" aria-hidden />
            </button>
            {isColorMenuOpen ? (
              <div className={`${MENU_PANEL} w-64 p-3`}>
                <div className="mb-2 flex rounded-md border border-gray-200 p-0.5">
                  <button
                    type="button"
                    onClick={() => setColorTab("text")}
                    className={`flex-1 rounded py-1.5 text-xs font-medium ${
                      colorTab === "text"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setColorTab("background")}
                    className={`flex-1 rounded py-1.5 text-xs font-medium ${
                      colorTab === "background"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Background
                  </button>
                </div>
                {colorTab === "text" ? (
                  <div className="flex flex-wrap gap-1.5">
                    {TEXT_PRESETS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className="h-7 w-7 rounded-md border border-gray-200 shadow-sm"
                        style={{ backgroundColor: c }}
                        title={c}
                        onClick={() => applyTextColor(c)}
                      />
                    ))}
                    <label className="flex h-7 cursor-pointer items-center rounded-md border border-gray-200 px-2 text-[10px] text-gray-600">
                      Custom
                      <input
                        type="color"
                        className="ml-1 h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
                        value={(editor?.getAttributes("textStyle").color as string) || "#111827"}
                        onChange={(e) => applyTextColor(e.target.value)}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {BG_PRESETS.map((c) => (
                      <button
                        key={c || "x"}
                        type="button"
                        className={`h-7 w-7 rounded-md border border-gray-200 shadow-sm ${
                          c === "transparent" ? "bg-white" : ""
                        }`}
                        style={c === "transparent" ? undefined : { backgroundColor: c }}
                        title={c === "transparent" ? "No highlight" : c}
                        onClick={() => applyBackgroundColor(c)}
                      >
                        {c === "transparent" ? (
                          <span className="block text-[10px] leading-7 text-gray-400">
                            ∅
                          </span>
                        ) : null}
                      </button>
                    ))}
                    <label className="flex h-7 cursor-pointer items-center rounded-md border border-gray-200 px-2 text-[10px] text-gray-600">
                      Custom
                      <input
                        type="color"
                        className="ml-1 h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
                        onChange={(e) => applyBackgroundColor(e.target.value)}
                      />
                    </label>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <ToolbarDivider />

          <div className="relative" ref={alignMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsAlignMenuOpen((o) => !o);
                setIsBlockMenuOpen(false);
                setIsMoreMenuOpen(false);
                setIsColorMenuOpen(false);
              }}
              className={DROPDOWN_BTN}
              title="Alignment"
            >
              <AlignIcon />
              <ChevronDownIcon className="h-4 w-4 text-gray-500" aria-hidden />
            </button>
            {isAlignMenuOpen ? (
              <div className={MENU_PANEL}>
                <button
                  type="button"
                  onClick={() => setTextAlign("left")}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-sm ${
                    alignment === "left" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                  }`}
                >
                  <Bars3BottomLeftIcon className="h-5 w-5" />
                  Left
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign("center")}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-sm ${
                    alignment === "center" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                  }`}
                >
                  <Bars3CenterLeftIcon className="h-5 w-5" />
                  Center
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign("right")}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-sm ${
                    alignment === "right" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                  }`}
                >
                  <Bars3BottomRightIcon className="h-5 w-5" />
                  Right
                </button>
              </div>
            ) : null}
          </div>

          <ToolbarDivider />

          <button
            type="button"
            className={`${ICON_BTN} ${editor?.isActive("link") ? ICON_BTN_ACTIVE : ""}`}
            onClick={setOrUnsetLink}
            disabled={!editor}
            title="Link"
          >
            <LinkIcon className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            className={ICON_BTN}
            disabled
            title="Images (coming soon)"
          >
            <PhotoIcon className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            className={ICON_BTN}
            disabled
            title="Video (coming soon)"
          >
            <PlayCircleIcon className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            className={ICON_BTN}
            disabled
            title="Table (coming soon)"
          >
            <TableCellsIcon className="h-5 w-5" aria-hidden />
          </button>

          <ToolbarDivider />

          <div className="relative" ref={moreMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsMoreMenuOpen((o) => !o);
                setIsBlockMenuOpen(false);
                setIsAlignMenuOpen(false);
                setIsColorMenuOpen(false);
              }}
              className={ICON_BTN}
              title="More"
            >
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden />
            </button>
            {isMoreMenuOpen ? (
              <div className={`${MENU_PANEL} right-0 left-auto sm:left-0 sm:right-auto`}>
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().toggleBulletList().run();
                    setIsMoreMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <ListBulletIcon className="h-4 w-4" />
                  Bulleted list
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().toggleOrderedList().run();
                    setIsMoreMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <NumberedListIcon className="h-4 w-4" />
                  Numbered list
                </button>
                <div className="my-1 border-t border-gray-100" />
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().sinkListItem("listItem").run();
                    setIsMoreMenuOpen(false);
                  }}
                  disabled={!editor?.can().sinkListItem("listItem")}
                  className="flex w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                >
                  Indent
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().liftListItem("listItem").run();
                    setIsMoreMenuOpen(false);
                  }}
                  disabled={!editor?.can().liftListItem("listItem")}
                  className="flex w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                >
                  Outdent
                </button>
                <div className="my-1 border-t border-gray-100" />
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().toggleStrike().run();
                    setIsMoreMenuOpen(false);
                  }}
                  className="flex w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Strikethrough
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().clearNodes().unsetAllMarks().run();
                    setIsMoreMenuOpen(false);
                  }}
                  className="flex w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Clear formatting
                </button>
              </div>
            ) : null}
          </div>

          <div className="min-w-4 flex-1" aria-hidden />

          <button
            type="button"
            onClick={handleToggleHtmlMode}
            className={`${ICON_BTN} ${isHtmlMode ? ICON_BTN_ACTIVE : ""}`}
            title={isHtmlMode ? "Visual editor" : "HTML / code"}
          >
            <CodeBracketIcon className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="max-h-[min(28rem,55vh)] overflow-y-auto bg-white">
          {isHtmlMode ? (
            <textarea
              value={htmlValue}
              onChange={(e) => {
                setHtmlValue(e.target.value);
                onChange(e.target.value);
              }}
              className="min-h-[220px] w-full resize-y border-0 px-4 py-3 font-mono text-sm text-gray-900 outline-none"
              spellCheck={false}
            />
          ) : (
            <EditorContent editor={editor} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionInput;
