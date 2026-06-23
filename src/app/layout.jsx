import "./globals.css";
import localFont from "next/font/local";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Providers from "@/app/providers";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920", // 가변 폰트 굵기 범위
});

export const metadata = {
  title: "판다마켓",
  description: "따뜻한 중고거래, 판다마켓 자유게시판",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
