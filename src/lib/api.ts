import { BASE_URL } from "@/lib/config";
import type {
  Article,
  AuthResponse,
  Comment,
  CommentListResponse,
  ListParams,
  ListResponse,
  Product,
  UploadResponse,
  User,
} from "../types/api";
import { Recoverable } from "node:repl";
import { promises } from "node:dns";

// fetch 옵션에 우리가 추가로 쓰는 필드를 얹은 타입
interface FetchOptions extends RequestInit {
  parse?: boolean;
  errorMessage?: string;
}

// localStorage에서 accessToken을 읽어 Authorization 헤더를 붙이는 fetch 래퍼.
// 401이 오면 토큰을 지우고 로그인 페이지로 이동한다.
// 제네릭 T = 이 요청이 반환할 JSON 타입 (호출부에서 지정)
async function tokenFetch<T>(
  path: string,
  { parse = true, ...options }: FetchOptions = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  // FormData면 브라우저가 multipart boundary를 포함해 Content-Type을 직접 설정해야 함
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
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

  return parse ? res.json() : (undefined as T);
}

// 인증 불필요한 기본 fetch 래퍼
async function apiFetch<T>(
  path: string,
  { errorMessage, parse = true, ...options }: FetchOptions = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // 서버가 준 메시지 우선 -> 호출부 errorMessage -> 기본 문구 순
    throw new Error(
      body.message ?? errorMessage ?? `요청에 실패했어요. (${res.status})`,
    );
  }

  return parse ? res.json() : (undefined as T);
}

// JSON 본문 옵션 헬퍼
function jsonBody(method: string, body: unknown): FetchOptions {
  return { method, body: JSON.stringify(body) };
}

// --- 인증 ---

// 로그인. 성공하면 { accessToken, refreshToken, user } 반환
export async function signIn(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/signIn", {
    ...jsonBody("POST", { email, password }),
  });
}

// 회원가입. 성공하면 { accessToken, refreshToken, user } 반환
export async function signUp(
  email: string,
  nickname: string,
  password: string,
  passwordConfirmation: string,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/signUp", {
    ...jsonBody("POST", { email, nickname, password, passwordConfirmation }),
  });
}

// --- 유저 ---

// 내 정보 조회 (토큰 필요)
export async function getMe(): Promise<User> {
  return tokenFetch<User>("/users/me");
}

// --- 이미지 ---

// 이미지 파일 업로드 (토큰 필요). 서버에 저장된 파일의 URL을 반환
export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("image", file);
  return tokenFetch<UploadResponse>("/images/upload", {
    method: "POST",
    body: formData,
  });
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
export async function getProduct(id: number | string): Promise<Product> {
  return tokenFetch<Product>(`/products/${id}`);
}

// 상품 등록 (토큰 필요)
export async function createProduct(
  data: Partial<Product> | Record<string, unknown>,
): Promise<Product> {
  return tokenFetch<Product>("/products", {
    ...jsonBody("POST", data),
  });
}

// 상품 수정 (토큰 필요)
export async function updateProduct(
  id: number | string,
  data: Partial<Product> | Record<string, unknown>,
): Promise<Product> {
  return tokenFetch<Product>(`/products/${id}`, {
    ...jsonBody("PATCH", data),
  });
}

// 상품 삭제 (토큰 필요)
export async function deleteProduct(id: number | string): Promise<void> {
  return tokenFetch<void>(`/products/${id}`, {
    method: "DELETE",
    parse: false,
  });
}

// 좋아요 추가 (토큰 필요)
export async function favoriteProduct(id: number | string): Promise<Product> {
  return tokenFetch<Product>(`/products/${id}/favorite`, { method: "POST" });
}

// 좋아요 취소 (토큰 필요)
export async function unfavoriteProduct(id: number | string): Promise<void> {
  return tokenFetch<void>(`/products/${id}/favorite`, {
    method: "DELETE",
    parse: false,
  });
}

// --- 댓글 (상품) ---

// cursor 페이지네이션
export async function getProductComments(
  productId: number | string,
  { cursor, limit = 10 }: { cursor?: number; limit?: number } = {},
): Promise<CommentListResponse> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", String(cursor));

  return tokenFetch<CommentListResponse>(
    `/products/${productId}/comments?${params}`,
  );
}

// 댓글 등록 (토큰 필요)
export async function createProductComment(
  productId: number | string,
  content: string,
): Promise<Comment> {
  return tokenFetch<Comment>(`/products/${productId}/comments`, {
    ...jsonBody("POST", { content }),
  });
}

// 댓글 수정 (토큰 필요)
export async function updateComment(
  commentId: number | string,
  content: string,
): Promise<Comment> {
  return tokenFetch<Comment>(`/comments/${commentId}`, {
    ...jsonBody("PATCH", { content }),
  });
}

// 댓글 삭제 (토큰 필요)
export async function deleteComment(commentId: number | string): Promise<void> {
  return tokenFetch<void>(`/comments/${commentId}`, {
    method: "DELETE",
    parse: false,
  });
}

// --- 게시글 ---

export async function getArticles({
  page = 1,
  pageSize = 10,
  keyword = "",
  orderBy = "recent",
}: ListParams = {}): Promise<ListResponse<Article>> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    orderBy,
  });
  if (keyword) params.set("keyword", keyword);
  return apiFetch(`/articles?${params}`, { cache: "no-store" });
}

// 베스트 게시글 - 좋아요 많은 순 상위 3개
export async function getBestArticles(): Promise<Article[]> {
  const { list } = await getArticles({ pageSize: 3, orderBy: "like" });
  return list;
}

export async function getArticle(id: number | string): Promise<Article> {
  return apiFetch<Article>(`/articles/${id}`, { cache: "no-store" });
}

export async function createArticle({
  title,
  content,
}: Pick<Article, "title" | "content">): Promise<Article> {
  return tokenFetch<Article>(`/articles`, {
    ...jsonBody("POST", { title, content }),
  });
}

export async function updateArticle(
  id: number | string,
  { title, content }: Partial<Pick<Article, "title" | "content">>,
): Promise<Article> {
  return tokenFetch<Article>(`/articles/${id}`, {
    ...jsonBody("PATCH", { title, content }),
  });
}

export async function deleteArticle(id: number | string): Promise<void> {
  return tokenFetch<void>(`/articles/${id}`, {
    method: "DELETE",
    parse: false,
  });
}

// --- 댓글 (게시글) ---

// 댓글 목록 (cursor 페이지네이션). noStore=false면 client 더보기용(브라우저 fetch).
export async function getComments(
  articleId: number | string,
  {
    cursor,
    limit = 5,
    noStore = true,
  }: { cursor?: number; limit?: number; noStore?: boolean } = {},
): Promise<CommentListResponse> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", String(cursor));
  return apiFetch<CommentListResponse>(
    `/articles/${articleId}/comments?${params}`,
    {
      ...(noStore ? { cache: "no-store" } : {}),
      errorMessage: "댓글을 불러오지 못했어요.",
    },
  );
}

export async function createComment(
  articleId: number | string,
  content: string,
): Promise<Comment> {
  return tokenFetch<Comment>(`/articles/${articleId}/comments`, {
    ...jsonBody("POST", { content }),
  });
}
