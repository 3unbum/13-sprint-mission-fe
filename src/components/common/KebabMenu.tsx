"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import Image from "next/image";

// 케밥 버튼 + 드롭다운. 메뉴 항목은 children으로 주입받아 재사용
// (게시글/댓글이 각자 다른 수정・삭제 동작을 넣음)
export default function KebabMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  // 바깥 클릭 판정을 위해 감싸는 div를 참조 (초기값 null이라 제네릭에 | null 필요 없음 - HTMLDivElement로 충분)
  const ref = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    // document 이벤트라 React 합성 이벤트가 아닌 DOM MouseEvent
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="메뉴 열기"
        className="flex h-6 w-6 items-center justify-center text-gray-400"
      >
        <Image src="/icons/ui/ic_kebab.svg" alt="메뉴 열기" width={24} height={24} />
      </button>

      {open && (
        <ul
          onClick={() => setTimeout(() => setOpen(false), 0)}
          className="absolute right-0 top-8 z-10 w-32 overflow-hidden rounded-lg border border-gray-200 bg-white text-center text-sm text-gray-500 shadow-sm"
        >
          {children}
        </ul>
      )}
    </div>
  );
}
