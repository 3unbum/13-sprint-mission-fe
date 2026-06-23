"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createComment,
  deleteArticle,
  updateComment,
  deleteComment,
} from "@/lib/api";
import { withFakeComment } from "@/lib/fakeData";

// 댓글 등록 - 생성된 댓글(가짜 닉네임 포함)을 반환해 client가 목록에 즉시 추가.
export async function createCommentAction(articleId, formData) {
  const content = formData.get("content")?.trim();
  if (!content) return null;

  const comment = await createComment(articleId, content);
  return withFakeComment(comment);
}

// 게시글 삭제 (변경 없음 - 목록으로 이동)
export async function deleteArticleAction(id) {
  await deleteArticle(id);

  revalidatePath("/boards"); // 목록 캐시 갱신 -> 삭제된 글 사라짐
  redirect("/boards");
}

// 댓글 수정 - 수정된 댓글을 반환해 client가 해당 항목 교체
export async function updateCommentAction(commentId, formData) {
  const content = formData.get("content")?.trim();
  if (!content) return null;

  const comment = await updateComment(commentId, content);
  return withFakeComment(comment);
}

// 댓글 삭제 성공 여부만 (client가 목록에서 제거)
export async function deleteCommentAction(commentId) {
  await deleteComment(commentId);
}
