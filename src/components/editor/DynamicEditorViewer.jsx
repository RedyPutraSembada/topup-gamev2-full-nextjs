import dynamic from "next/dynamic";

export const EditorViewer = dynamic(() => import("@/components/editor/EditorBlockNoteViewer"), {
  ssr: false,
});
