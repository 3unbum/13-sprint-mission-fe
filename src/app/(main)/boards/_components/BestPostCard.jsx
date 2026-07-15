import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/formatDate";

// 베스트 게시글 카드 1개 (서버 컴포넌트)
export default function BestPostCard({ article }) {
  return (
    <li className="rounded-lg bg-gray-50 px-6 pb-4">
      {/* Best 뱃지 */}
      <Image src="/icons/ui/ic_badge.svg" alt="Best" width={102} height={30} />

      <Link href={`/boards/${article.id}`} className="mt-3 block">
        <div className="flex items-start justify-between gap-4">
          <h3 className="line-clamp-2 text-base font-semibold text-gray-800">
            {article.title}
          </h3>
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200">
            <Image
              src={article.image || "/images/default-article.png"}
              alt={article.title}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">{article.nickname}</span>
            <span className="flex items-center gap-1">
              <Image
                src="/icons/ui/ic_heart_inactive.svg"
                alt="좋아요"
                width={16}
                height={16}
              />
              {article.likeCount}
            </span>
          </div>
          <span>{formatDate(article.createdAt)}</span>
        </div>
      </Link>
    </li>
  );
}
