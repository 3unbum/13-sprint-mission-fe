import { BASE_URL } from "./config";

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
