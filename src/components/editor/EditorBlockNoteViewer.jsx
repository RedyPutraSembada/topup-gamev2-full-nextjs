"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";

export default function BlockNoteViewer({ content }) {
  const initialContent = Array.isArray(content)
    ? content
    : typeof content === "string"
    ? JSON.parse(content)
    : [];

  const editor = useCreateBlockNote({
    initialContent,
    editable: false,
  });

  if (!editor) return null;

  return (
    <BlockNoteView
      editor={editor}
      editable={false}
      theme="dark"
      className="prose max-w-none"
    />
  );
}
