// API 기본 주소. Next에서는 process.env.NEXT_PUBLIC_*로 읽는다. (Import.meta.env 아님).
// 멘토 피드백: env로 관리하되, sprint8는 외부 공개 API를 fallback으로 둔다.
export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://panda-market-api.vercel.app";
