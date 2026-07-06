"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteArticle } from "@/lib/api";

// 게시글 삭제 (변경 없음 - 목록으로 이동)
export async function deleteArticleAction(id) {
  await deleteArticle(id);

  revalidatePath("/boards"); // 목록 캐시 갱신 -> 삭제된 글 사라짐
  redirect("/boards");
}
