import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// 전역 CSS는 import 순서가 중요.
// fonts(폰트 로드) → variables(CSS 변수 정의) → reset(기본 스타일 초기화).
// 변수가 정의되기 전에 reset에서 var(--xxx) 쓰면 적용 안 됨.
import "./styles/fonts.css";
import "./styles/variables.css";
import "./styles/reset.css";
import App from "./App.jsx";

// React 18+ 부터의 새 root API. ReactDOM.render 대신 createRoot 사용.
// index.html의 <div id="root"> 안에 App을 그려넣음.
createRoot(document.getElementById("root")).render(
  // StrictMode: 개발 모드에서만 작동. useEffect를 두 번 실행하는 등으로
  // 부작용 있는 코드를 빨리 발견하게 도와줌. 프로덕션에선 영향 없음.
  <StrictMode>
    <App />
  </StrictMode>,
);
