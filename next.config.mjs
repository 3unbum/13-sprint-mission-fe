/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // Next 16은 SSRF 방지로 최적화 서버가 사설/루프백 IP로 풀리는 이미지를 차단
    // 로컬 백엔드의 업로드 이미지용으로 허용
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      // 자체 백엔드 (multer 업로드 이미지)용
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
      },
    ],
  },
};

export default nextConfig;
