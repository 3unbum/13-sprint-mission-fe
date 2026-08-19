// API 기본 주소. Next에서는 process.env.NEXT_PUBLIC_*로 읽는다. (Import.meta.env 아님)
export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://panda-market-api.vercel.app";
