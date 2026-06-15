import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import type ReactQuillType from "react-quill-new";
import { useServerFn } from "@tanstack/react-start";

// Quill touches `document` at import time, so load it only in the browser.
const ReactQuill = lazy(() => import("react-quill-new"));
import { uploadAnnouncementImage } from "@/lib/storage.functions";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

/**
 * Premium rich-text editor powered by Quill (the same engine used by
 * LinkedIn, Slack drafts, and many production CMSs). Free, open source,
 * battle-tested — formatting buttons (bold, italic, color, lists, etc.)
 * are fully managed by Quill so toggling works reliably.
 */
export function RichEditor({ value, onChange, placeholder }: Props) {
  const uploadFn = useServerFn(uploadAnnouncementImage);
  const quillRef = useRef<ReactQuillType | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [uploading, setUploading] = useState(false);

  // Image upload handler — hooks into Quill's toolbar "image" button so
  // images are uploaded to our storage instead of embedded as base64.
  const imageHandler = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/webp,image/gif";
    input.onchange = async () => {
      const file = input.files?.[0];
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
        const editor = quillRef.current?.getEditor();
        if (editor) {
          const range = editor.getSelection(true);
          editor.insertEmbed(range.index, "image", res.url, "user");
          editor.setSelection({ index: range.index + 1, length: 0 });
        }
      } catch (e) {
        alert(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          [{ font: [] }, { size: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
        ],
        handlers: { image: imageHandler },
      },
      clipboard: { matchVisual: false },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const formats = [
    "header", "font", "size",
    "bold", "italic", "underline", "strike",
    "color", "background",
    "list",
    "align",
    "blockquote", "code-block",
    "link", "image",
  ];

  // Keep external value in sync (e.g. clearing after publish).
  useEffect(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
    const current = editor.root.innerHTML;
    if ((value || "") !== current && (value || "<p><br></p>") !== current) {
      // Only reset when fully different to avoid caret jumps on every keystroke.
      if (!value) editor.setText("");
    }
  }, [value]);

  return (
    <div className="rich-editor overflow-hidden rounded-xl border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-foreground/20">
      {mounted ? (
        <Suspense fallback={<div className="px-4 py-6 text-sm text-muted-foreground">Loading editor…</div>}>
          <ReactQuill
            ref={(el) => { quillRef.current = el; }}
            theme="snow"
            value={value}
            onChange={onChange}
            placeholder={placeholder ?? "Write your post…"}
            modules={modules}
            formats={formats}
          />
        </Suspense>
      ) : (
        <div className="px-4 py-6 text-sm text-muted-foreground">Loading editor…</div>
      )}
      {uploading && (
        <div className="border-t border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
          Uploading image…
        </div>
      )}
      <style>{`
        .rich-editor .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid var(--border);
          background: color-mix(in oklab, var(--muted) 70%, transparent);
          padding: 10px 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .rich-editor .ql-container.ql-snow {
          border: none;
          font-family: inherit;
          font-size: 15px;
          min-height: 280px;
        }
        .rich-editor .ql-editor {
          min-height: 280px;
          color: var(--foreground);
          padding: 14px 16px;
        }
        .rich-editor .ql-editor.ql-blank::before {
          color: var(--muted-foreground);
          font-style: normal;
          left: 16px;
          right: 16px;
        }
        /* Force visible icons regardless of theme tokens */
        .rich-editor .ql-snow .ql-stroke,
        .rich-editor .ql-snow .ql-stroke-miter { stroke: var(--foreground); }
        .rich-editor .ql-snow .ql-fill,
        .rich-editor .ql-snow .ql-even { fill: var(--foreground); }
        .rich-editor .ql-snow .ql-picker,
        .rich-editor .ql-snow .ql-picker-label { color: var(--foreground); }
        .rich-editor .ql-snow .ql-picker-label {
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 2px 22px 2px 8px;
        }
        .rich-editor .ql-snow .ql-picker-options {
          background: var(--popover);
          border: 1px solid var(--border) !important;
          color: var(--popover-foreground);
          border-radius: 8px;
          padding: 6px;
          box-shadow: 0 8px 24px -8px rgb(0 0 0 / 0.18);
        }
        .rich-editor .ql-snow.ql-toolbar button,
        .rich-editor .ql-snow .ql-picker-label {
          height: 30px;
          border-radius: 6px;
        }
        .rich-editor .ql-snow.ql-toolbar button { width: 32px; }
        .rich-editor .ql-snow.ql-toolbar button:hover,
        .rich-editor .ql-snow.ql-toolbar button.ql-active,
        .rich-editor .ql-snow .ql-picker-label:hover,
        .rich-editor .ql-snow .ql-picker-label.ql-active {
          background: color-mix(in oklab, var(--foreground) 8%, transparent);
          color: var(--primary);
        }
        .rich-editor .ql-snow.ql-toolbar button:hover .ql-stroke,
        .rich-editor .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: var(--primary);
        }
        .rich-editor .ql-snow.ql-toolbar button:hover .ql-fill,
        .rich-editor .ql-snow.ql-toolbar button.ql-active .ql-fill {
          fill: var(--primary);
        }
        .rich-editor .ql-editor img { border-radius: 12px; margin: 12px 0; max-width: 100%; }
        .rich-editor .ql-editor blockquote {
          border-left: 3px solid var(--primary);
          padding-left: 12px;
          color: var(--muted-foreground);
        }
        .rich-editor .ql-tooltip { z-index: 50; }
      `}</style>
    </div>
  );
}
