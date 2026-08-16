"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "@/lib/api";
import ProductForm from "@/app/(main)/items/_components/ProductForm";
import type { ProductFormValues } from "@/app/(main)/items/_components/ProductForm";
import type { Product } from "@/types/api";

interface EditFormProps {
  id: number | string;
  product: Product;
}

export default function EditForm({ id, product }: EditFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 제네릭: <성공 시 반환 타입, 에러 타입, mutate에 넘기는 인자 타입>
  const updateMutation = useMutation<Product, Error, ProductFormValues>({
    mutationFn: (values) => updateProduct(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push(`/items/${id}`);
    },
    onError: (err) => alert(err.message),
  });

  return (
    <ProductForm
      title="상품 수정하기"
      submitLabel="수정 완료"
      isPending={updateMutation.isPending}
      initialValues={product}
      onSubmit={(values) => updateMutation.mutate(values)}
    />
  );
}
