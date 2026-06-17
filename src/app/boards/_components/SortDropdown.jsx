"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
    OPTIONS.find((o) => o.value === current)?.label ?? "최신순";

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
        className="flex h-11 w-32 items-center justify-between rounded-lg border border-gray-200 px-4 text-base text-gray-800"
      >
        {currentLabel}
        <span className="text-gray-400">▾</span>
      </button>

      {open && (
        <ul className="absolute right-0 z-10 mt-1 w-32 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
          {OPTIONS.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => handleSelect(o.value)}
                className="block w-full px-4 py-3 text-left text-base text-gray-800 hover:bg-gray-50"
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
