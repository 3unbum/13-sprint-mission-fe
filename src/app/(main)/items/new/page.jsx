"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "@/lib/api";
import ProductForm from "@/app/(main)/items/_components/ProductForm";

export default function NewItemPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (values) => createProduct(values),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // 등록한 상품 상세로 이동
      router.push(`/items/${created.id}`);
    },
    onError: (err) => alert(err.message),
  });

  return (
    <ProductForm
      title="상품 등록하기"
      submitLabel="등록"
      isPending={createMutation.isPending}
      onSubmit={(values) => createMutation.mutate(values)}
    />
  );
}
