import { BASE_URL } from "@/lib/config";

// 게시글 목록 조회 (서버 컴포넌트에서 호출)
export async function getArticles({
  page = 1,
  pageSize = 10,
  keyword = "",
  sort = "recent",
} = {}) {
  // 프론트는 page, 백엔드는 offset -> 변환
  const offset = (page - 1) * pageSize;

  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(pageSize),
    sort,
  });
  if (keyword) params.set("keyword", keyword);

  // cache: "no-store" -> 매 요청마다 최신 목록 (게시판은 자주 바뀌므로)
  const res = await fetch(`${BASE_URL}/articles?${params}`, {
    cache: "no-store",
  });

  // fetch는 4xx/5xx에 reject 안 함 -> 직접 확인
  if (!res.ok)
    throw new Error(`게시글 목록을 불러오지 못했어요. (${res.status})`);

  return res.json(); // { list, totalCount }
}

// 베스트 게시글 - 좋아요 많은 순 상위 N개.
// 백엔드가 좋아요를 안 주므로, 넉넉히 가져와 프론트에서 가짜 likeCount로 정렬한다.
export async function getBestArticles(take = 3) {
  const { list } = await getArticles({ pageSize: 30 });
  return list;
}

// 게시글 등록 (Server Action에서 호출)
export async function createArticle({ title, content }) {
  const res = await fetch(`${BASE_URL}/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });

  if (!res.ok) throw new Error(`게시글 등록에 실패했어요. (${res.status})`);

  return res.json(); // 생성된 article
}

// 게시글 상세 조회 (서버 컴포넌트에서 호출)
export async function getArticle(id) {
  const res = await fetch(`${BASE_URL}/articles/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`게시글을 불러오지 못했어요. (${res.status})`);

  return res.json(); // article
}

// 게시글 댓글 목록 조회 (cursor 페이지네이션)
export async function getComments(articleId, { cursor, limit = 5 } = {}) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", String(cursor));

  const res = await fetch(
    `${BASE_URL}/articles/${articleId}/comments?${params}`,
    { cache: "no-store" },
  );

  if (!res.ok) throw new Error(`댓글을 불러오지 못했어요. (${res.status})`);

  return res.json(); // { list, nextCursor }
}

// 댓글 더보기 (client에서 호출) cursor로 다음 페이지를 가져온다.
export async function getMoreComments(articleId, cursor, limit = 5) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", String(cursor));

  const res = await fetch(
    `${BASE_URL}/articles/${articleId}/comments?${params}`,
  );

  if (!res.ok) throw new Error(`댓글을 불러오지 못했어요. (${res.status})`);

  return res.json(); // { list, nextCursor }
}

// 댓글 등록 (Server Action에서 호출)
export async function createComment(articleId, content) {
  const res = await fetch(`${BASE_URL}/articles/${articleId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) throw new Error(`댓글 등록에 실패했어요. (${res.status})`);

  return res.json(); // 생성된 comment
}

// 게시글 삭제 (Server Action에서 호출)
export async function deleteArticle(id) {
  const res = await fetch(`${BASE_URL}/articles/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error(`게시글 삭제에 실패했어요. (${res.status})`);
}

// 댓글 수정 (Server Action에서 호출)
export async function updateComment(id, content) {
  const res = await fetch(`${BASE_URL}/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) throw new Error(`댓글 수정에 실패했어요. (${res.status})`);

  return res.json(); // 수정된 comment
}

// 댓글 삭제 (Server Action에서 호출)
export async function deleteComment(id) {
  const res = await fetch(`${BASE_URL}/comments/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error(`댓글 삭제에 실패했어요. (${res.status})`);
}

// 게시글 수정 (Server Action에서 호출)
export async function updateArticle(id, { title, content }) {
  const res = await fetch(`${BASE_URL}/articles/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });

  if (!res.ok) throw new Error(`게시글 수정에 실패했어요. (${res.status})`);

  return res.json(); // 수정된 article
}
