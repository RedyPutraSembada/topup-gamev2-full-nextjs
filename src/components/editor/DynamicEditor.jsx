import dynamic from "next/dynamic";

export const Editor = dynamic(() => import("@/components/editor/EditorBlockNote"), {
  ssr: false,
});
