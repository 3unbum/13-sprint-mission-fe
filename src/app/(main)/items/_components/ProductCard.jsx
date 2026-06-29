"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// 상품 카드 한 장 - 이미지, 이름, 가격, 좋아요 순
export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);

  // image[0]이 없거나(null) 로드에 실패하면 (imgError) 기본 이미지로
  const imageSrc =
    imgError || !product.images?.[0]
      ? "/images/default-article.png"
      : product.images[0];

  return (
    <Link href={`/items/${product.id}`} className="block">
      {/* 썸네일 (정사각) - 외부 S3 URL이라 우선 일반 img로 */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
          className="object-cover"
          onError={() => setImgError(true)}
        />
      </div>

      <h3 className="mt-3 truncate text-sm font-medium text-gray-800">
        {product.name}
      </h3>
      <p className="mt-3 truncate text-sm font-bold text-gray-800">
        {product.price.toLocaleString()}원
      </p>
      <span className="mt-1 flex items-center gap-1 text-xs text-gray-500">
        <Image
          src="/icons/ui/ic_heart_inactive.svg"
          alt="좋아요"
          width={16}
          height={16}
        />
        {product.favoriteCount}
      </span>
    </Link>
  );
}
