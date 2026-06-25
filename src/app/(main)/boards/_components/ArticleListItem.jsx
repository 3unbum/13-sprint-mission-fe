import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/formatDate";
import Avatar from "@/components/common/Avatar";

// 게시글 한 줄 (서버 컴포넌트 - 인터렉션 없음)
export default function ArticleListItem({ article }) {
  return (
    <li className="border-b border-gray-200 py-6">
      <Link href={`/boards/${article.id}`} className="block">
        {/* 제목 + 썸네일 */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {article.title}
          </h3>
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200">
            <Image
              src={article.image ?? "/images/default-article.png"}
              alt={article.title}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        </div>

        {/* 닉네임 • 날짜 (좌) / 좋아요 (우) */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Avatar size={24} />
            <span className="text-gray-600">{article.nickname}</span>
            <span>{formatDate(article.createdAt)}</span>
          </div>
          <span className="flex items-center gap-1">
            <Image
              src="/icons/ic_heart_inactive.svg"
              alt="좋아요"
              width={16}
              height={16}
            />
            {article.likeCount}
          </span>
        </div>
      </Link>
    </li>
  );
}
