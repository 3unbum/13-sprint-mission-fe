import { getArticle, getComments } from "@/lib/api";
import CommentList from "@/app/(main)/boards/[id]/_components/CommentList";
import { formatDate } from "@/lib/formatDate";
import Link from "next/link";
import Image from "next/image";
import KebabMenu from "@/components/common/KebabMenu";
import DeleteArticleButton from "@/app/(main)/boards/[id]/_components/DeleteArticleButton";
import Avatar from "@/components/common/Avatar";

// 게시글 상세 (서버 컴포넌트)
export default async function ArticleDetailPage({ params }) {
  const { id } = await params;

  const [article, commentsData] = await Promise.all([
    getArticle(id),
    getComments(id),
  ]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
      {/* 본문 카드 */}
      <article className="border-b border-gray-200 pb-6">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-bold text-gray-900">{article.title}</h1>

          <KebabMenu>
            <li>
              <Link
                href={`/boards/${article.id}/edit`}
                className="block py-3 hover:bg-gray-50"
              >
                수정하기
              </Link>
            </li>
            <li>
              <DeleteArticleButton articleId={article.id} />
            </li>
          </KebabMenu>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
          <Avatar size={40} />
          <span className="text-gray-600">{article.nickname}</span>
          <span>{formatDate(article.createdAt)}</span>
          <span className="ml-4 flex items-center gap-1 border-l border-gray-200 pl-4">
            <Image
              src="/icons/ui/ic_heart_inactive.svg"
              alt="좋아요"
              width={20}
              height={20}
            />
            {article.likeCount}
          </span>
        </div>

        <p className="mt-6 whitespace-pre-wrap text-base text-gray-800">
          {article.content}
        </p>
      </article>

      {/* 댓글 */}
      <section className="mt-8">
        <h2 className="mb-4 text-base font-semibold text-gray-900">댓글달기</h2>
        <CommentList
          initialComments={commentsData.list}
          initialCursor={commentsData.nextCursor}
          articleId={article.id}
        />
      </section>

      {/* 목록으로 돌아가기 */}
      <div className="mt-12 flex justify-center">
        <Link
          href="/boards"
          className="flex h-12 items-center gap-2 rounded-full bg-brand-blue px-6 text-base font-semibold text-white"
        >
          목록으로 돌아가기
          <Image
            src="/icons/ui/ic_back.svg"
            alt="목록으로 돌아가기"
            width={24}
            height={24}
          />
        </Link>
      </div>
    </div>
  );
}
