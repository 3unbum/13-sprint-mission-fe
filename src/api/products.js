// API 호출을 컴포넌트 안에 직접 쓰지 않고 별도 모듈로 분리한 이유:
// 1. 같은 호출이 여러 곳(BestProducts, AllProducts)에서 재사용됨 → 중복 제거
// 2. URL이나 에러 처리 방식 변경 시 한 곳만 수정
// 3. 컴포넌트는 "데이터를 가져온다"는 의도만 표현 (UI와 통신 분리)

const BASE_URL = "https://panda-market-api.vercel.app";

// 객체로 인자를 받는 패턴: 호출 시 어떤 값인지 명확함.
// getProducts({ page: 2, orderBy: "favorite" }) ← 가독성 좋음
// 각 필드에 기본값을 줘서 일부만 넘겨도 동작.
// 마지막 ` = {}` : 인자 자체를 안 줘도 죽지 않게 빈 객체 기본값.
export async function getProducts({
  page = 1,
  pageSize = 10,
  orderBy = "recent",
  keyword = "",
} = {}) {
  // URLSearchParams: 쿼리 문자열을 안전하게 만들어주는 브라우저 내장 객체.
  // 직접 "?page=1&pageSize=10" 이어붙이는 것보다 인코딩(한글/특수문자) 자동 처리.
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    orderBy,
  });
  // keyword는 비어있을 땐 URL에 추가 안 함.
  // ?keyword= 처럼 빈 값으로 보내지 않게.
  if (keyword) params.set("keyword", keyword);

  const res = await fetch(`${BASE_URL}/products?${params.toString()}`);
  // ⚠️ fetch는 4xx/5xx 응답에도 reject하지 않음.
  // res.ok (200~299인지) 직접 확인 후 에러 던져야 함.
  // 안 그러면 깨진 응답에 대해 res.json()이 이상한 결과 반환.
  if (!res.ok) {
    throw new Error(`상품 목록을 불러오지 못했어요. (${res.status})`);
  }
  // res.json(): 응답 본문을 JSON으로 파싱한 결과를 반환.
  // 호출자는 { totalCount, list } 객체를 바로 받음.
  return res.json();
}
