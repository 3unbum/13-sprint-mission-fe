import { getArticle, getComments } from "@/lib/api";
import { withFake, withFakeComment } from "@/lib/fakeData";
import CommentList from "@/app/boards/[id]/_components/CommentList";
import CommentForm from "@/app/boards/[id]/_components/CommentForm";
import { formatDate } from "@/lib/formatDate";
import Link from "next/link";
import Image from "next/image";
import KebabMenu from "@/components/common/KebabMenu";
import { deleteArticleAction } from "@/app/boards/[id]/actions";

// 게시글 상세 (서버 컴포넌트)
export default async function ArticleDetailPage({ params }) {
  const { id } = await params;

  const [articleRaw, commentsData] = await Promise.all([
    getArticle(id),
    getComments(id),
  ]);
  const article = withFake(articleRaw);
  const comments = commentsData.list.map(withFakeComment);

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
              {/* id를 액션에 미리 묶어서, 폼 제출 시 deleteArticleAction(id) 호출 */}
              <form action={deleteArticleAction.bind(null, article.id)}>
                <button type="submit" className="w-full py-3 hover:bg-gray-50">
                  삭제하기
                </button>
              </form>
            </li>
          </KebabMenu>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
          <Image
            src="/images/profile.png"
            alt=""
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-gray-600">{article.nickname}</span>
          <span>{formatDate(article.createdAt)}</span>
          <span className="ml-4 border-l border-gray-200 pl-4">
            ♡ {article.likeCount}
          </span>
        </div>

        <p className="mt-6 whitespace-pre-wrap text-base text-gray-800">
          {article.content}
        </p>
      </article>

      {/* 댓글 */}
      <section className="mt-8">
        <h2 className="mb-4 text-base font-semibold text-gray-900">댓글달기</h2>
        <CommentForm articleId={article.id} />
        <div className="mt-6">
          <CommentList comments={comments} articleId={article.id} />
        </div>
      </section>

      {/* 목록으로 돌아가기 */}
      <div className="mt-12 flex justify-center">
        <Link
          href="/boards"
          className="flex h-12 items-center gap-2 rounded-full bg-brand-blue px-6 text-base font-semibold text-white"
        >
          목록으로 돌아가기 ↩
        </Link>
      </div>
    </div>
  );
}
