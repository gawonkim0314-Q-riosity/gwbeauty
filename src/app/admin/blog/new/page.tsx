"use client";

import { BlogEditorWorkspace, emptyEditorState } from "@/admin/blog/_components/BlogEditorWorkspace";

export default function AdminBlogNewPage() {
  return <BlogEditorWorkspace initial={emptyEditorState()} />;
}
