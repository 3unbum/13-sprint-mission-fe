"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { getProduct } from "@/lib/api";
import Avatar from "@/components/common/Avatar";
import { formatDate } from "@/lib/formatDate";

export default function ItemDetailPage({ params }) {
  // Next 16: params는 Promise라 use()로 언래핑
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
          <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
            {product.name}
          </h1>
          <p className="mt-3 text-2xl font-bold text-gray-900 md:text-4xl">
            {product.price.toLocaleString()}원
          </p>

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

          {/* 판매자 + 좋아요 (좋아요 동작은 다음 단계에서 연결) */}
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
              <span className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-base text-gray-500">
                <Image
                  src={
                    product.isFavorite
                      ? "/icons/ic_heart_active.svg"
                      : "/icons/ic_heart_inactive.svg"
                  }
                  alt="좋아요"
                  width={20}
                  height={20}
                />
                {product.favoriteCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/*  상품 정보 영역 아래 가로 구분선 */}
      <hr className="mt-6 border-gray-200" />

      {/* 목록으로 돌아가기 */}
      <div className="mt-10 flex justify-center">
        <Link
          href="/items"
          className="flex items-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-base font-semibold text-white"
        >
          목록으로 돌아가기
          <Image
            src="/icons/ic_back.svg"
            alt="목록으로 돌아가기"
            width={20}
            height={20}
          />
        </Link>
      </div>
    </div>
  );
}
