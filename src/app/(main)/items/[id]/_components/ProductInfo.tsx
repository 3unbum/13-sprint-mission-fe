"use client";

import Image from "next/image";
import Avatar from "@/components/common/Avatar";
import KebabMenu from "@/components/common/KebabMenu";
import { formatDate } from "@/lib/formatDate";
import type { Product } from "@/types/api";

interface ProductInfoProps {
  product: Product;
  isOwner: boolean;
  onEdit: () => void;
  onDeleteClick: () => void;
  onFavorite: () => void;
  favoritePending?: boolean;
}

// 상품 상세 상단 정보 블록 (이미지 + 제목/가격/케밥 + 소개/태그 + 판매자/좋아요).
// 데이터 패칭/뮤테이션은 페이지가 담당하고, 여기는 표시 + 콜백만.
export default function ProductInfo({
  product,
  isOwner,
  onEdit,
  onDeleteClick,
  onFavorite,
  favoritePending,
}: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row">
      {/* 이미지 */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 md:w-[486px]">
        <Image
          src={product.images?.[0] || "/images/default-article.png"}
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
                onClick={onEdit}
                className="cursor-pointer py-3 hover:bg-gray-50"
              >
                수정하기
              </li>
              <li
                onClick={onDeleteClick}
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

        <h3 className="mt-6 text-sm font-semibold text-gray-600">상품 태그</h3>
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
          {/* 판매자: 아바타 + 닉네임 + 등록일 */}
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
              onClick={onFavorite}
              disabled={favoritePending}
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
  );
}
