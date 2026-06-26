"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/lib/api";
import EditForm from "./EditForm";

export default function ItemEditPage({ params }) {
  const { id } = use(params);

  const {
    data: product,
    isPending,
    error,
  } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
  });

  if (isPending) {
    return (
      <p className="py-20 text-center text-gray-400">불러오고 있어요...</p>
    );
  }
  if (error) {
    return (
      <p className="py-20 text-center text-red-400">
        상품을 불러오지 못했어요. 로그인이 필요할 수 있어요.
      </p>
    );
  }

  // product가 확정된 뒤에만 폼 마운트 -> 초기값을 props로 직접 주입 (effect 불필요)
  return <EditForm id={id} product={product} />;
}
