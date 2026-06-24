/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // 상품 이미지는 사용자가 임의 URL을 넣어 호스트가 제각각이라
    // 모든 https 호스트를 허용한다. (학습용 - 운영에선 호스트를 좁히는 게 안전)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
