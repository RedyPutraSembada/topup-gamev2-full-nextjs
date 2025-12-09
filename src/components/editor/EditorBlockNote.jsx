"use client"

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { toast } from "sonner";
import "@blocknote/shadcn/style.css";

const uriUpload = process.env.NEXT_PUBLIC_UPLOAD_URI
const MAX_FILE_SIZE_MB = process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB

export default function EditorBlockNote({ initialContent, onChange }) {

    const handleUpload = async (file) => {
        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024) // Convert size to MB
        if (fileSizeMB > MAX_FILE_SIZE_MB) {
            toast.error(`File size should not exceed ${MAX_FILE_SIZE_MB} MB.`)
            return ''
        }

        const formData = new FormData()
        formData.append('file', file)
        const url = `${uriUpload}/upload`

        try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        })
        if (!response.ok) {
            toast.error('Failed to upload file')
            return ''
        }
        const data = await response.json()
        return data.fileUrl || ''
        } catch (error) {
            toast.error('Error uploading file')
            return ''
        }
    }

    const editor = useCreateBlockNote({
        initialContent: initialContent || [
            {
                type: "paragraph",
                content: "Hello BlockNote!",
            },
        ],
        uploadFile: handleUpload,
    });
    

  return (
      <BlockNoteView
          editor={editor}
          theme="dark"
          onChange={() => {
            onChange(editor.document)
          }}
          editable={true}
        />
  );
}