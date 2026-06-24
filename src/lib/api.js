import { BASE_URL } from "@/lib/config";

// 공통 fetch 래퍼. fetch는 4xx/5xx에 reject 안 하므로 res.ok를 직접 확인한다
// DELETE처럼 본문 없는 응답은 json 파싱을 건너뛴다
async function apiFetch(path, { errorMessage, parse = true, ...options } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) throw new Error(`${errorMessage} (${res.status})`);
  return parse ? res.json() : undefined;
}

// POST/PATCH 공통 옵션 (JSON 본문)
function jsonBody(method, body) {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

// --- 게시글 ---

export async function getArticles({
  page = 1,
  pageSize = 10,
  keyword = "",
  sort = "recent",
} = {}) {
  const offset = (page - 1) * pageSize; // 프론트는 page, 백엔드는 offset
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(pageSize),
    sort,
  });
  if (keyword) params.set("keyword", keyword);

  return apiFetch(`/articles?${params}`, {
    cache: "no-store",
    errorMessage: "게시글 목록을 불러오지 못했어요.",
  });
}

// 백엔드가 좋아요를 안 주므로 넉넉히 받아 프론트에게 가짜 likeCount로 정렬한다.
export async function getBestArticles() {
  const { list } = await getArticles({ pageSize: 30 });
  return list;
}

export async function createArticle({ title, content }) {
  return apiFetch(`/articles`, {
    ...jsonBody("POST", { title, content }),
    errorMessage: "게시글 등록에 실패했어요",
  });
}

export async function getArticle(id) {
  return apiFetch(`/articles/${id}`, {
    cache: "no-store",
    errorMessage: "게시글을 불러오지 못했어요.",
  });
}

export async function updateArticle(id, { title, content }) {
  return apiFetch(`/articles/${id}`, {
    ...jsonBody("PATCH", { title, content }),
    errorMessage: "게시글 수정에 실패했어요.",
  });
}

export async function deleteArticle(id) {
  return apiFetch(`/articles/${id}`, {
    method: "DELETE",
    parse: false,
    errorMessage: "게시글 삭제에 실패했어요.",
  });
}

// --- 댓글 ---

// 댓글 목록 (cursor 페이지네이션). noStore=false면 client 더보기용(브라우저 fetch).
export async function getComments(
  articleId,
  { cursor, limit = 5, noStore = true } = {},
) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", String(cursor));

  return apiFetch(`/articles/${articleId}/comments?${params}`, {
    ...(noStore ? { cache: "no-store" } : {}),
    errorMessage: "댓글을 불러오지 못했어요.",
  });
}

export async function createComment(articleId, content) {
  return apiFetch(`/articles/${articleId}/comments`, {
    ...jsonBody("POST", { content }),
    errorMessage: "댓글 등록에 실패했어요.",
  });
}

export async function updateComment(id, content) {
  return apiFetch(`/comments/${id}`, {
    ...jsonBody("PATCH", { content }),
    errorMessage: "댓글 수정에 실패했어요.",
  });
}

export async function deleteComment(id) {
  return apiFetch(`/comments/${id}`, {
    method: "DELETE",
    parse: false,
    errorMessage: "댓글 삭제에 실패했어요.",
  });
}
