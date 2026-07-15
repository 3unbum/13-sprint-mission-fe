"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {
  getProduct,
  favoriteProduct,
  unfavoriteProduct,
  deleteProduct,
} from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import CommentSection from "@/app/(main)/items/[id]/_components/CommentSection";
import ProductInfo from "@/app/(main)/items/[id]/_components/ProductInfo";
import DeleteConfirmModal from "@/app/(main)/items/[id]/_components/DeleteConfirmModal";

export default function ItemDetailPage({ params }) {
  // Next 16: params는 Promise라 use()로 언래핑
  const router = useRouter();
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = use(params);
  const queryClient = useQueryClient();

  const {
    data: product,
    isPending,
    error,
  } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
  });

  // 좋아요 토글 (현재 상태 반대로 호출 -> 성공 시 상세 캐시 갱신)
  const favoriteMutation = useMutation({
    mutationFn: () =>
      product.isFavorite ? unfavoriteProduct(id) : favoriteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
  });

  // 상품 삭제 -> 성공 시 목록 캐시 무효화하고 /items로 이동
  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/items");
    },
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
        상품을 불러오지 못햇어요. 로그인이 필요할 수 있어요.
      </p>
    );
  }

  // 내가 올린 상품일 때만 수정/삭제 케밥 노출
  const isOwner = user?.id === product.ownerId;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
      <ProductInfo
        product={product}
        isOwner={isOwner}
        onEdit={() => router.push(`/items/${id}/edit`)}
        onDeleteClick={() => setShowDeleteModal(true)}
        onFavorite={() => favoriteMutation.mutate()}
        favoritePending={favoriteMutation.isPending}
      />

      {/* 상품 정보 영역 아래 가로 구분선 */}
      <hr className="mt-6 border-gray-200" />

      {/* 문의(댓글) 영역 */}
      <CommentSection productId={id} />

      {/* 목록으로 돌아가기 */}
      <div className="mt-10 flex justify-center">
        <Link
          href="/items"
          className="flex items-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-base font-semibold text-white"
        >
          목록으로 돌아가기
          <Image
            src="/icons/ui/ic_back.svg"
            alt="목록으로 돌아가기"
            width={20}
            height={20}
          />
        </Link>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <DeleteConfirmModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => deleteMutation.mutate()}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
