"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "@/lib/api";

export default function EditForm({ id, product }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 초기값을 useState로 한 번만 세팅 -> effect 불필요 (부모가 product 로드 후에만 마운트)
  const [form, setForm] = useState({
    name: product.name ?? "",
    description: product.description ?? "",
    price: String(product.price ?? ""),
    tags: (product.tags ?? []).join(", "),
    images: (product.images ?? []).join(", "),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateProduct(id, {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        images: form.images
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push(`/items/${id}`);
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  // 입력값 공통 변경 핸들러
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // 필수값(이름/가격) 채워졌을 때만 활성화
  const isValid = form.name.trim() && form.price !== "";

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">상품 수정하기</h1>
        <button
          type="button"
          onClick={() => updateMutation.mutate()}
          disabled={!isValid || updateMutation.isPending}
          className="rounded-lg bg-brand-blue px-6 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          수정 완료
        </button>
      </div>

      <form className="flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-700">상품명</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="상품명을 입력해 주세요"
            className="rounded-lg bg-gray-100 px-6 py-3 text-base text-gray-800 outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-700">상품 소개</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            placeholder="상품 소개를 입력해 주세요"
            className="resize-none rounded-lg bg-gray-100 px-6 py-3 text-base text-gray-800 outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-700">판매 가격</span>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="판매 가격을 입력해 주세요"
            className="rounded-lg bg-gray-100 px-6 py-3 text-base text-gray-800 outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-700">
            태그 (쉼표로 구분)
          </span>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="태그, 태그2"
            className="rounded-lg bg-gray-100 px-6 py-3 text-base text-gray-800 outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-700">
            이미지 URL (쉼표로 구분)
          </span>
          <input
            name="images"
            value={form.images}
            onChange={handleChange}
            placeholder="https://..."
            className="rounded-lg bg-gray-100 px-6 py-3 text-base text-gray-800 outline-none"
          />
        </label>
      </form>
    </div>
  );
}
