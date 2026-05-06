import { useEffect, useState } from "react";

// 화면 너비를 받아서 그리드에 어울리는 pageSize 반환.
// hook 밖에 둔 이유: 매 렌더마다 다시 만들 필요 없는 순수 함수라서.
// 그리드 컬럼과 짝을 맞춰 항상 "2행"이 되게 설계 (5x2, 3x2, 2x2).
function getPageSize(width) {
  if (width >= 1200) return 10; // Desktop: 5열 x 2행
  if (width >= 744) return 6; // Tablet: 3열 x 2행
  return 4; // Mobile: 2열 x 2행
}

export default function useResponsivePageSize() {
  // useState의 초기값으로 함수를 넘기는 형태 (lazy initializer).
  // useState(getPageSize(window.innerWidth)) 라고 쓰면
  // 매 렌더마다 getPageSize가 호출되고 결과가 무시됨 → 낭비.
  // 함수로 감싸면 "첫 렌더 때 한 번만" 실행됨.
  const [pageSize, setPageSize] = useState(() =>
    getPageSize(window.innerWidth),
  );

  useEffect(() => {
    function handleResize() {
      setPageSize(getPageSize(window.innerWidth));
    }
    // 브라우저 창 크기가 바뀔 때마다 handleResize 실행됨.
    window.addEventListener("resize", handleResize);
    // cleanup 함수: 컴포넌트가 사라질 때 리스너 제거.
    // 안 하면 메모리 누수 + 사라진 컴포넌트의 setState 호출 시도 (경고).
    return () => window.removeEventListener("resize", handleResize);
  }, []); // 빈 배열: 마운트 시 한 번만 등록

  return pageSize;
}
