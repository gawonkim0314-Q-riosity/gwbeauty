/**
 * Presigned-URL style upload using Vercel Blob's handleUpload.
 *
 * Flow:
 *  1. Client POSTs { filename, contentType } → server returns { url, token }
 *  2. Client PUTs the file directly to Vercel Blob CDN using the token
 *  3. Client receives the final blob.url
 *
 * This keeps binary data off the Next.js serverless function.
 */

import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "application/pdf",
];

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const ext = pathname.split(".").pop()?.toLowerCase() ?? "";
        const contentType =
          ext === "jpg" || ext === "jpeg"
            ? "image/jpeg"
            : ext === "png"
            ? "image/png"
            : ext === "webp"
            ? "image/webp"
            : ext === "gif"
            ? "image/gif"
            : ext === "mp4"
            ? "video/mp4"
            : ext === "webm"
            ? "video/webm"
            : ext === "pdf"
            ? "application/pdf"
            : "application/octet-stream";

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          tokenPayload: JSON.stringify({ pathname, contentType }),
          maximumSizeInBytes: 200 * 1024 * 1024, // 200 MB
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Blob upload complete callback
        // Can be used to update DB here, or handled client-side
        console.log("[upload] complete:", blob.url, tokenPayload);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
