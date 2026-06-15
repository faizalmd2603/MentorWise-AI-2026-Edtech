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
      <ReactQuill
        ref={(el) => { quillRef.current = el; }}
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder ?? "Write your post…"}
        modules={modules}
        formats={formats}
      />
      {uploading && (
        <div className="border-t border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
          Uploading image…
        </div>
      )}
      <style>{`
        .rich-editor .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid hsl(var(--border));
          background: linear-gradient(to bottom, hsl(var(--muted) / 0.6), hsl(var(--muted) / 0.3));
          padding: 8px;
        }
        .rich-editor .ql-container.ql-snow {
          border: none;
          font-family: inherit;
          font-size: 15px;
          min-height: 280px;
        }
        .rich-editor .ql-editor {
          min-height: 280px;
          color: hsl(var(--foreground));
          padding: 14px 16px;
        }
        .rich-editor .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          font-style: normal;
        }
        .rich-editor .ql-snow .ql-stroke { stroke: hsl(var(--foreground)); }
        .rich-editor .ql-snow .ql-fill { fill: hsl(var(--foreground)); }
        .rich-editor .ql-snow .ql-picker { color: hsl(var(--foreground)); }
        .rich-editor .ql-snow .ql-picker-options {
          background: hsl(var(--popover));
          border-color: hsl(var(--border));
          color: hsl(var(--popover-foreground));
        }
        .rich-editor .ql-snow.ql-toolbar button:hover,
        .rich-editor .ql-snow.ql-toolbar button.ql-active,
        .rich-editor .ql-snow .ql-picker-label:hover,
        .rich-editor .ql-snow .ql-picker-label.ql-active {
          color: hsl(var(--primary));
        }
        .rich-editor .ql-snow.ql-toolbar button:hover .ql-stroke,
        .rich-editor .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: hsl(var(--primary));
        }
        .rich-editor .ql-snow.ql-toolbar button:hover .ql-fill,
        .rich-editor .ql-snow.ql-toolbar button.ql-active .ql-fill {
          fill: hsl(var(--primary));
        }
        .rich-editor .ql-editor img { border-radius: 12px; margin: 12px 0; max-width: 100%; }
        .rich-editor .ql-editor blockquote {
          border-left: 3px solid hsl(var(--primary));
          padding-left: 12px;
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
}
