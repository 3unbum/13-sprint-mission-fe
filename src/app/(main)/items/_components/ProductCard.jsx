import Link from "next/link";

// 상품 카드 한 장 - 이미지, 이름, 가격, 좋아요 순
export default function ProductCard({ product }) {
  return (
    <Link href={`/items/${product.id}`} className="block">
      {/* 썸네일 (정사각) - 외부 S3 URL이라 우선 일반 img로 */}
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
        <img
          src={product.images?.[0] ?? "/images/default-article.png"}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <h3 className="mt-3 truncate text-sm font-medium text-gray-800">
        {product.name}
      </h3>
      <p className="mt-3 truncate text-sm font-medium text-gray-800">
        {product.price.toLocaleString()}원
      </p>
      <span className="mt-1 flex items-center gap-1 text-xs text-gray-500">
        ♡ {product.favoriteCount}
      </span>
    </Link>
  );
}
