"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const OPTIONS = [
  { value: "recent", label: "최신순" },
  { value: "oldest", label: "오래된순" },
];

// 정렬 드롭다운 - 선택 시 URL sort를 갱신한다. (page는 1로 초기화)
export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const current = searchParams.get("sort") ?? "recent";
  const currentLabel =
    OPTIONS.find((option) => option.value === current)?.label ?? "최신순";

  function handleSelect(value) {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    params.delete("page");
    router.push(`/boards?${params}`);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 text-gray-800 md:w-32 md:justify-between md:px-4 md:text-base"
      >
        {/* 모바일: 정렬 아이콘만 / 태블릿+: 라벨 + 화살표 */}
        <Image
          src="/icons/ic_sort.svg"
          alt="정렬"
          width={24}
          height={24}
          className="md:hidden"
        />
        <span className="hidden md:inline">{currentLabel}</span>
        <Image
          src="/icons/ic_arrow_down.svg"
          alt="정렬 옵션 펼치기"
          width={20}
          height={20}
          className="hidden md:inline"
        />
      </button>

      {open && (
        <ul className="absolute right-0 z-10 mt-1 w-32 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
          {OPTIONS.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => handleSelect(option.value)}
                className="block w-full px-4 py-3 text-left text-base text-gray-800 hover:bg-gray-50"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
