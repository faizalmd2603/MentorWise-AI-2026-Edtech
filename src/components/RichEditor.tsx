import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import FontFamily from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Smile,
  Quote,
  Heading2,
  Undo2,
  Redo2,
  Palette,
  Highlighter,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { uploadAnnouncementImage } from "@/lib/storage.functions";

const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Inter", value: "Inter, ui-sans-serif, system-ui, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Mono", value: "Menlo, Consolas, monospace" },
  { label: "Rounded", value: "'SF Pro Rounded', 'Nunito', sans-serif" },
];

const FONT_SIZES = [
  { label: "S", value: "0.875rem" },
  { label: "M", value: "1rem" },
  { label: "L", value: "1.125rem" },
  { label: "XL", value: "1.375rem" },
  { label: "2XL", value: "1.75rem" },
];

const COLORS = [
  "#0b1220", "#374151", "#6b7280",
  "#dc2626", "#ea580c", "#f59e0b",
  "#16a34a", "#0ea5e9", "#2563eb",
  "#7c3aed", "#db2777",
];

const HIGHLIGHTS = [
  "#fde68a", "#fecaca", "#bbf7d0",
  "#bfdbfe", "#ddd6fe", "#fbcfe8",
];

const BULLET_STYLES: { label: string; symbol: string; css: string }[] = [
  { label: "Dot", symbol: "•", css: "disc" },
  { label: "Circle", symbol: "◦", css: "circle" },
  { label: "Square", symbol: "▪", css: "square" },
  { label: "Star", symbol: "★", css: "'★  '" },
  { label: "Arrow", symbol: "➤", css: "'➤  '" },
  { label: "Check", symbol: "✔", css: "'✔  '" },
  { label: "Diamond", symbol: "◆", css: "'◆  '" },
];

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichEditor({ value, onChange, placeholder }: Props) {
  const uploadFn = useServerFn(uploadAnnouncementImage);
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showHi, setShowHi] = useState(false);
  const [showBullets, setShowBullets] = useState(false);
  const [bulletStyle, setBulletStyle] = useState<string>("disc");
  const [fontSize, setFontSize] = useState<string>("1rem");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg my-3 max-w-full" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      Placeholder.configure({ placeholder: placeholder ?? "Write your post…" }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "min-h-[280px] max-w-none px-4 py-3 focus:outline-none prose prose-sm sm:prose-base dark:prose-invert text-foreground",
        style: `font-size: ${fontSize}`,
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) {
    return <div className="rounded-xl border border-border bg-background p-6 text-muted-foreground">Loading editor…</div>;
  }

  async function handleImage(file: File) {
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      alert("Image must be under 6 MB.");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Could not read file"));
        reader.readAsDataURL(file);
      });
      const res = await uploadFn({ data: { dataUrl, filename: file.name } });
      editor!.chain().focus().setImage({ src: res.url, alt: file.name }).run();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <div className="rounded-xl border border-input bg-background shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 px-2 py-2">
        <ToolBtn label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn label="Strike" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="h-4 w-4" />
        </ToolBtn>

        <Divider />

        <ToolBtn label="Heading" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </ToolBtn>

        <Divider />

        {/* Font family */}
        <select
          aria-label="Font family"
          className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
          onChange={(e) => {
            const v = e.target.value;
            if (!v) editor.chain().focus().unsetFontFamily().run();
            else editor.chain().focus().setFontFamily(v).run();
          }}
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f.label} value={f.value}>{f.label}</option>
          ))}
        </select>

        {/* Font size — applied to editor wrapper */}
        <select
          aria-label="Font size"
          value={fontSize}
          className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
          onChange={(e) => {
            setFontSize(e.target.value);
            const el = editor.view.dom as HTMLElement;
            el.style.fontSize = e.target.value;
          }}
        >
          {FONT_SIZES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <Divider />

        {/* Color */}
        <Popover open={showColor} onClose={() => setShowColor(false)} trigger={
          <ToolBtn label="Text color" onClick={() => { setShowColor((v) => !v); setShowHi(false); setShowEmoji(false); setShowBullets(false); }}>
            <Palette className="h-4 w-4" />
          </ToolBtn>
        }>
          <div className="grid grid-cols-6 gap-1.5 p-2">
            {COLORS.map((c) => (
              <button key={c} type="button" className="h-6 w-6 rounded border border-border" style={{ background: c }}
                onClick={() => { editor.chain().focus().setColor(c).run(); setShowColor(false); }} aria-label={`Color ${c}`} />
            ))}
            <button type="button" className="col-span-6 mt-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => { editor.chain().focus().unsetColor().run(); setShowColor(false); }}>Reset color</button>
          </div>
        </Popover>

        {/* Highlight */}
        <Popover open={showHi} onClose={() => setShowHi(false)} trigger={
          <ToolBtn label="Highlight" onClick={() => { setShowHi((v) => !v); setShowColor(false); setShowEmoji(false); setShowBullets(false); }}>
            <Highlighter className="h-4 w-4" />
          </ToolBtn>
        }>
          <div className="grid grid-cols-6 gap-1.5 p-2">
            {HIGHLIGHTS.map((c) => (
              <button key={c} type="button" className="h-6 w-6 rounded border border-border" style={{ background: c }}
                onClick={() => { editor.chain().focus().toggleHighlight({ color: c }).run(); setShowHi(false); }} aria-label={`Highlight ${c}`} />
            ))}
            <button type="button" className="col-span-6 mt-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => { editor.chain().focus().unsetHighlight().run(); setShowHi(false); }}>Clear highlight</button>
          </div>
        </Popover>

        <Divider />

        {/* Bullets dropdown */}
        <Popover open={showBullets} onClose={() => setShowBullets(false)} trigger={
          <button type="button" onClick={() => { setShowBullets((v) => !v); setShowColor(false); setShowHi(false); setShowEmoji(false); }}
            className="inline-flex h-8 items-center gap-1 rounded-md border border-input bg-background px-2 text-xs text-foreground hover:bg-foreground/5"
            aria-label="Bullet style">
            <List className="h-4 w-4" /> Bullets <ChevronDown className="h-3 w-3" />
          </button>
        }>
          <div className="w-48 p-1">
            {BULLET_STYLES.map((b) => (
              <button key={b.label} type="button"
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-foreground/5"
                onClick={() => {
                  setBulletStyle(b.css);
                  editor.chain().focus().toggleBulletList().run();
                  // Apply chosen marker style to the active list element
                  setTimeout(() => {
                    const root = editor.view.dom as HTMLElement;
                    root.querySelectorAll("ul").forEach((ul) => ((ul as HTMLElement).style.listStyle = b.css));
                  }, 0);
                  setShowBullets(false);
                }}>
                <span className="flex items-center gap-2"><span className="w-5 text-center">{b.symbol}</span>{b.label}</span>
              </button>
            ))}
            <div className="my-1 h-px bg-border" />
            <button type="button" className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-foreground/5"
              onClick={() => { editor.chain().focus().toggleOrderedList().run(); setShowBullets(false); }}>
              <ListOrdered className="h-4 w-4" /> Numbered list
            </button>
          </div>
        </Popover>

        <Divider />

        {/* Emoji */}
        <Popover open={showEmoji} onClose={() => setShowEmoji(false)} trigger={
          <ToolBtn label="Emoji" onClick={() => { setShowEmoji((v) => !v); setShowColor(false); setShowHi(false); setShowBullets(false); }}>
            <Smile className="h-4 w-4" />
          </ToolBtn>
        }>
          <EmojiPicker
            theme={Theme.AUTO}
            emojiStyle={EmojiStyle.NATIVE}
            onEmojiClick={(e) => { editor.chain().focus().insertContent(e.emoji).run(); setShowEmoji(false); }}
            width={320}
            height={380}
          />
        </Popover>

        {/* Link */}
        <ToolBtn label="Link" active={editor.isActive("link")} onClick={() => {
          const prev = editor.getAttributes("link").href as string | undefined;
          const url = window.prompt("URL", prev ?? "https://");
          if (url === null) return;
          if (!url) editor.chain().focus().extendMarkRange("link").unsetLink().run();
          else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }}>
          <LinkIcon className="h-4 w-4" />
        </ToolBtn>

        {/* Image upload */}
        <ToolBtn label="Image" onClick={() => fileInput.current?.click()}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
        </ToolBtn>
        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImage(f);
          }}
        />

        <Divider />

        <ToolBtn label="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo2 className="h-4 w-4" /></ToolBtn>
        <ToolBtn label="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo2 className="h-4 w-4" /></ToolBtn>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function ToolBtn({
  children, onClick, active, label,
}: { children: React.ReactNode; onClick: () => void; active?: boolean; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-foreground transition ${
        active ? "border-foreground bg-foreground text-background" : "border-transparent hover:bg-foreground/5"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px bg-border" aria-hidden />;
}

function Popover({
  open, onClose, trigger, children,
}: { open: boolean; onClose: () => void; trigger: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative">
      {trigger}
      {open && (
        <>
          <button type="button" aria-label="Close" className="fixed inset-0 z-10 cursor-default" onClick={onClose} />
          <div className="absolute left-0 top-full z-20 mt-1 rounded-lg border border-border bg-popover shadow-lg">
            {children}
          </div>
        </>
      )}
    </div>
  );
}

