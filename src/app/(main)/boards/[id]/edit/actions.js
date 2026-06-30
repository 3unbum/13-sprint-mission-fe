"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateArticle } from "@/lib/api";

// 게시글 수정 Server Action. id는 폼에서 .bind로 묶어 넘긴다
export async function updateArticleAction(id, formData) {
  const title = formData.get("title")?.trim();
  const content = formData.get("content")?.trim();

  if (!title || !content) {
    throw new Error("제목과 내용을 모두 입력해주세요.");
  }

  await updateArticle(id, { title, content });

  revalidatePath(`/boards/${id}`); // 상세 갱신 -> 수정 내용 반영
  redirect(`/boards/${id}`); // 수정 후 상세로 이동
}
