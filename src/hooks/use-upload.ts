"use client";

import { upload } from "@vercel/blob/client";
import { useState, useCallback } from "react";
import { getAdminAuthHeaders } from "@/lib/auth/admin-fetch";

export type UploadState = "idle" | "uploading" | "done" | "error";

export interface UseUploadResult {
  uploadFile: (file: File, folder?: string) => Promise<string | null>;
  state: UploadState;
  progress: number;
  url: string | null;
  error: string | null;
  reset: () => void;
}

export function useUpload(): UseUploadResult {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setState("idle");
    setProgress(0);
    setUrl(null);
    setError(null);
  }, []);

  const uploadFile = useCallback(
    async (file: File, folder = "uploads"): Promise<string | null> => {
      setState("uploading");
      setProgress(0);
      setError(null);
      setUrl(null);

      try {
        const pathname = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

        const authHeaders = await getAdminAuthHeaders();

        const blob = await upload(pathname, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
          headers: authHeaders,
          onUploadProgress: ({ percentage }) => {
            setProgress(Math.round(percentage));
          },
        });

        setUrl(blob.url);
        setState("done");
        return blob.url;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        setState("error");
        return null;
      }
    },
    []
  );

  return { uploadFile, state, progress, url, error, reset };
}
