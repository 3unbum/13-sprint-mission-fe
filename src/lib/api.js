import { BASE_URL } from "@/lib/config.js";

// localStorage에서 accessToken을 읽어 Authorization 헤더를 붙이는 fetch 래퍼.
// 401이 오면 토큰을 지우고 로그인 페이지로 이동한다.
async function tokenFetch(path, { parse = true, ...options } = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      window.location.href = "/signin";
    }
    throw new Error("인증이 필요해요. 다시 로그인해 주세요.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `요청에 실패했어요. (${res.status})`);
  }

  return parse ? res.json() : undefined;
}

// 인증 불필요한 기본 fetch 래퍼
async function apiFetch(path, { parse = true, ...options } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `요청에 실패했어요. (${res.status})`);
  }

  return parse ? res.json() : undefined;
}

// JSON 본문 옵션 헬퍼
function jsonBody(method, body) {
  return { method, body: JSON.stringify(body) };
}

// --- 인증 ---

// 로그인. 성공하면 { accessToken, refreshToken, user } 반환
export async function signIn(email, password) {
  return apiFetch("/auth/signIn", {
    ...jsonBody("POST", { email, password }),
  });
}

// 회원가입. 성공하면 { accessToken, refreshToken, user } 반환
export async function signUp(email, nickname, password, passwordConfirmation) {
  return apiFetch("/auth/signUp", {
    ...jsonBody("POST", { email, nickname, password, passwordConfirmation }),
  });
}

// --- 유저 ---

// 내 정보 조회 (토큰 필요)
export async function getMe() {
  return tokenFetch("/users/me");
}

// --- 상품 ---

export async function getProducts({
  page = 1,
  pageSize = 10,
  keyword = "",
  orderBy = "recent", // "recent" | "favorite"
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    orderBy,
  });
  if (keyword) params.set("keyword", keyword);

  // 상품 목록은 비로그인도 볼 수 있어요
  return apiFetch(`/products?${params}`, { cache: "no-store" });
}

// 상품 상세 (토큰 필요 - 요구사항: 인가된 사용자만)
export async function getProduct(id) {
  return tokenFetch(`/products/${id}`);
}

// 상품 수정 (토큰 필요)
export async function updateProduct(id, data) {
  return tokenFetch(`/products/${id}`, {
    ...jsonBody("PATCH", data),
  });
}

// 상품 삭제 (토큰 필요)
export async function deleteProduct(id) {
  return tokenFetch(`/products/${id}`, {
    method: "DELETE",
    parse: false,
  });
}

// 좋아요 추가 (토큰 필요)
export async function favoriteProduct(id) {
  return tokenFetch(`/products/${id}/favorite`, { method: "POST" });
}

// 좋아요 취소 (토큰 필요)
export async function unfavoriteProduct(id) {
  return tokenFetch(`/products/${id}/favorite`, {
    method: "DELETE",
    parse: false,
  });
}

// --- 댓글 (상품) ---

// cursor 페이지네이션
export async function getProductComments(
  productId,
  { cursor, limit = 10 } = {},
) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", String(cursor));

  return tokenFetch(`/products/${productId}/comments?${params}`);
}

// 댓글 등록 (토큰 필요)
export async function createProductComment(productId, content) {
  return tokenFetch(`/products/${productId}/comments`, {
    ...jsonBody("POST", { content }),
  });
}

// 댓글 수정 (토큰 필요)
export async function updateComment(commentId, content) {
  return tokenFetch(`/comments/${commentId}`, {
    ...jsonBody("PATCH", { content }),
  });
}

// 댓글 삭제 (토큰 필요)
export async function deleteComment(commentId) {
  return tokenFetch(`/comments/${commentId}`, {
    method: "DELETE",
    parse: false,
  });
}
