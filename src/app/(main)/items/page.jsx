"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api";
import ProductCard from "@/app/(main)/items/_components/ProductCard";

export default function ItemsPage() {
  // 상품 목록을 React Query로 패칭 - queryKey가 캐시 식별자
  const { data, isPending, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts({ page: 1, pageSize: 10, orderBy: "recent" }),
  });

  if (isPending) {
    return (
      <p className="py-20 text-center text-gray-400">
        상품을 불러오고 있어요...
      </p>
    );
  }

  if (error) {
    return (
      <p className="py-20 text-center text-red-400">
        상품을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
      <h2 className="mb-6 text-xl font-bold text-gray-900">판매 중인 상품</h2>

      {/* 반응형 그리드 : 모바일 2열 -> 태블릳 3열 -> PC 5열 */}
      <ul className="grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-3 md:gap-x-4 xl:grid-cols-5">
        {data.list.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
