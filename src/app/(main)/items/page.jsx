"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api";
import ProductCard from "@/app/(main)/items/_components/ProductCard";
import Pagination from "@/components/common/Pagination";

export default function ItemsPage() {
  // keywordInput: 입력창의 현재 값 (타이핑마다 바뀜)
  // keyword: 실제 검색에 쓰는 확정된 값 (Enter/제출 시에만 갱신)
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [orderBy, setOrderBy] = useState("recent");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // queryKey에 필터를 넣으면 값이 바뀔 때마다 React Query가 자동 재요청 + 캐싱
  const { data, isPending, error } = useQuery({
    queryKey: ["products", { keyword, orderBy, page }],
    queryFn: () => getProducts({ page, pageSize: PAGE_SIZE, keyword, orderBy }),
  });

  // 베스트 상품 - 좋아요순 상위 4개 (검색/페이지와 무관, 별도 캐싱)
  const { data: bestData } = useQuery({
    queryKey: ["products", "best"],
    queryFn: () => getProducts({ page: 1, pageSize: 4, orderBy: "favorite" }),
  });

  // 전체 페이지 수 (데이터 오기 전엔 0)
  const totalPages = data ? Math.ceil(data.totalCount / PAGE_SIZE) : 0;

  // 검색 제출 - 입력값을 실제 검색어로 확정
  function handleSearch(e) {
    e.preventDefault();
    setKeyword(keywordInput.trim());
    setPage(1); // 검색하면 첫 페이지로
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
      {/* 베스트 상품 - 좋아요순 상위 4개. PC 4 / Tablet 2 / Mobile 1 */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-gray-900">베스트 상품</h2>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-4">
          {bestData?.list.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-gray-900">판매 중인 상품</h2>

        <div className="flex items-center gap-3">
          {/* 검색 폼 - Enter 또는 버튼으로 제출 */}
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="검색할 상품을 입력해주세요"
              className="h-11 w-60 rounded-lg bg-gray-100 px-4 text-base outline-none"
            />
          </form>

          {/* 상품 등록하기 - 등록 페이지로 이동 */}
          <Link
            href="/items/new"
            className="flex h-11 items-center whitespace-nowrap rounded-lg bg-brand-blue px-6 text-sm font-semibold text-white"
          >
            상품 등록하기
          </Link>

          {/* 정렬 - select로 간단하게 */}
          <select
            value={orderBy}
            onChange={(e) => {
              setOrderBy(e.target.value);
              setPage(1); // 검색하면 첫 페이지로
            }}
            className="h-11 cursor-pointer appearance-none rounded-lg border border-gray-200 bg-[url('/icons/ui/ic_arrow_down.svg')] bg-[length:20px] bg-[right_0.75rem_center] bg-no-repeat py-2 pl-3 pr-9 text-base text-gray-800"
          >
            <option value="recent">최신순</option>
            <option value="favorite">좋아요순</option>
          </select>
        </div>
      </div>

      {/* 로딩/에러/목록 - 헤더(검색·정렬)는 항상 보이도록 아래에서 분기 */}
      {isPending ? (
        <p className="py-20 text-center text-gray-400">
          상품을 불러오고 있어요...
        </p>
      ) : error ? (
        <p className="py-20 text-center text-red-400">
          상품을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      ) : data.list.length === 0 ? (
        <p className="py-20 text-center text-gray-400">
          검색 결과가 없어요. 다른 검색어를 입력해보세요.
        </p>
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-3 md:gap-x-4 xl:grid-cols-5">
            {data.list.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
