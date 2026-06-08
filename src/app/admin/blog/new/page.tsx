"use client";

import { BlogEditorWorkspace, emptyEditorState } from "@/components/admin/blog/BlogEditorWorkspace";

export default function AdminBlogNewPage() {
  return <BlogEditorWorkspace initial={emptyEditorState()} />;
}
