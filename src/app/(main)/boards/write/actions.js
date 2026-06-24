"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createArticle } from "@/lib/api";

// 게시글 등록 Server Action - 폼에서 직접 호출 (action={...})
export async function createArticleAction(formData) {
  const title = formData.get("title")?.trim();
  const content = formData.get("content")?.trim();

  if (!title || !content) {
    throw new Error("제목과 내용을 모두 입력해주세요.");
  }

  const article = await createArticle({ title, content });

  revalidatePath("/boards"); // 목록 캐시 무효화 -> 새 글 반영
  redirect(`/boards/${article.id}`); // 등록 후 상세로 이동
}
