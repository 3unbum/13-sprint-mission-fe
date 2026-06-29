"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "@/lib/api";
import ProductForm from "@/app/(main)/items/_components/ProductForm";

export default function EditForm({ id, product }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
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
