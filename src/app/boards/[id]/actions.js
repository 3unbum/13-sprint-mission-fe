"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createComment,
  deleteArticle,
  updateComment,
  deleteComment,
} from "@/lib/api";

// 댓글 등록 Server Action.
// articleId는 폼에서 .bind로 미리 묶어 넘간다 (FormData엔 content만).
export async function createCommentAction(articleId, formData) {
  const content = formData.get("content")?.trim();
  if (!content) return;

  await createComment(articleId, content);

  revalidatePath(`/boards/${articleId}`); // 상세 페이지 갱신 -> 새 댓글 반영
}

// 게시글  삭제 Server Action
// 삭제 후엔 머물 상세 페이지가 사라지므로 목록으로 보낸다.
export async function deleteArticleAction(id) {
  await deleteArticle(id);

  revalidatePath("/boards"); // 목록 캐시 갱신 -> 삭제된 글 사라짐
  redirect("/boards");
}

// 댓글 수정 Server Action
// commentId·articleId를 .bind로 미리 묶고, content만 FormData로 받는다.
export async function updateCommentAction(commentId, articleId, formData) {
  const content = formData.get("content")?.trim();
  if (!content) return;

  await updateComment(commentId, content);

  revalidatePath(`/boards/${articleId}`); // 상세 갱신 -> 수정된 댓글 반영
}

// 댓글 삭제 Server Action
export async function deleteCommentAction(commentId, articleId) {
  await deleteComment(commentId);

  revalidatePath(`/boards/${articleId}`); // 상세 갱신 -> 삭제된 댓글 사라짐
}
