import ItemPage from "./pages/ItemPage";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// 라우터 안 쓰는 단일 페이지 구조.
// URL이 '/' 하나뿐이라 ItemPage를 직접 렌더.
// 나중에 페이지 늘어나면 react-router-dom 도입해서 ItemPage 자리에 <Routes> 넣음.
export default function App() {
  return (
    <div>
      <Navbar />
      <ItemPage />
      <Footer />
    </div>
  );
}
