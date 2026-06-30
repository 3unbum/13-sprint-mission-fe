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
import Avatar from "@/components/common/Avatar";
import { formatDate } from "@/lib/formatDate";
import { useAuth } from "@/providers/AuthProvider";
import KebabMenu from "@/components/common/KebabMenu";
import CommentSection from "@/app/(main)/items/[id]/_components/CommentSection";

export default function ItemDetailPage({ params }) {
  // Next 16: params는 Promise라 use()로 언래핑
  const router = useRouter();
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = use(params);

  const {
    data: product,
    isPending,
    error,
  } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
  });

  const queryClient = useQueryClient();

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
      {/* 상품 정보 : 모바일 세로 / 태블릿 + 가로 2단 */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* 이미지 */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 md:w-[486px]">
          <Image
            src={product.images?.[0] ?? "/images/default-article.png"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 486px"
            className="object-cover"
          />
        </div>

        {/* 정보 */}
        <div className="flex-1">
          {/* 제목 + 케밥 */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
                {product.name}
              </h1>
              <p className="mt-3 text-2xl font-bold text-gray-900 md:text-4xl">
                {product.price.toLocaleString()}원
              </p>
            </div>
            {isOwner && (
              <KebabMenu>
                <li
                  onClick={() => router.push(`/items/${id}/edit`)}
                  className="cursor-pointer py-3 hover:bg-gray-50"
                >
                  수정하기
                </li>
                <li
                  onClick={() => setShowDeleteModal(true)}
                  className="cursor-pointer py-3 hover:bg-gray-50"
                >
                  삭제하기
                </li>
              </KebabMenu>
            )}
          </div>

          <hr className="my-4 border-gray-200" />

          <h3 className="text-sm font-semibold text-gray-600">상품 소개</h3>
          <p className="mt-2 whitespace-pre-wrap text-base text-gray-800">
            {product.description}
          </p>

          <h3 className="mt-6 text-sm font-semibold text-gray-600">
            상품 태그
          </h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {product.tags?.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-gray-100 px-4 py-1.5 text-base text-gray-800"
              >
                #{tag}
              </li>
            ))}
          </ul>

          {/* 판매자 + 좋아요 */}
          <div className="mt-16 flex items-center justify-between">
            {/* 판매자: 아바타 + 닉네임 + 등록일  */}
            <div className="flex items-center gap-4">
              <Avatar size={40} />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-gray-600">
                  {product.ownerNickname}
                </span>
                <span className="text-sm text-gray-400">
                  {formatDate(product.createdAt)}
                </span>
              </div>
            </div>

            {/* 세로 구분선 + 좋아요 */}
            <div className="flex items-center gap-6">
              <span className="h-[34px] w-px bg-gray-200" />
              <button
                type="button"
                onClick={() => favoriteMutation.mutate()}
                disabled={favoriteMutation.isPending}
                className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-base text-gray-500"
              >
                <Image
                  src={
                    product.isFavorite
                      ? "/icons/ui/ic_heart_active.svg"
                      : "/icons/ui/ic_heart_inactive.svg"
                  }
                  alt="좋아요"
                  width={20}
                  height={20}
                />
                {product.favoriteCount}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*  상품 정보 영역 아래 가로 구분선 */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex w-[330px] flex-col items-center rounded-2xl bg-white px-6 py-7">
            {/* 빨강 원형 체크 아이콘 */}
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12l5 5L20 7" />
              </svg>
            </span>

            <p className="mt-4 text-base text-gray-700">
              정말로 상품을 삭제하시겠어요?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border border-red-500 px-7 py-2 text-sm font-semibold text-red-500"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-red-500 px-7 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                네
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
