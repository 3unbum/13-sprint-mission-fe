"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

// 검색바 - 제출 시 URL keyword를 갱신한다. (page는 1로 초기화)
export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSubmit(e) {
    e.preventDefault();
    const keyword = e.target.keyword.value.trim();

    const params = new URLSearchParams(searchParams);
    if (keyword) params.set("keyword", keyword);
    else params.delete("keyword");
    params.delete("page"); // 검색하면 1페이지부터

    router.push(`/boards?${params}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex-1">
      <span className="absolute top-1/2 left-4 -translate-y-1/2">
        <Image src="/icons/ui/ic_search.svg" alt="검색" width={24} height={24} />
      </span>
      <input
        name="keyword"
        type="text"
        defaultValue={searchParams.get("keyword") ?? ""}
        placeholder="검색할 상품을 입력해주세요"
        className="h-11 w-full rounded-lg bg-gray-100 pr-4 pl-11 text-base text-gray-800 placeholder:text-gray-400"
      />
    </form>
  );
}
