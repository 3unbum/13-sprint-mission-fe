import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

// 헤더/푸터가 필요한 페이지들(/, /boards, /items ...)의 공통 레리아웃
// (auth) 그룹(로그인/회원가입)에는 적용되지 않음
export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
