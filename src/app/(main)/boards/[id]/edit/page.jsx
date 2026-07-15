import { getArticle } from "@/lib/api";
import ArticleForm from "@/app/(main)/boards/write/_components/ArticleForm";

// 게시글 수정 페이지 (서버 컴포넌트 - 기존 글을 받아 폼에 prefill)
export default async function EditPage({ params }) {
  const { id } = await params;
  const article = await getArticle(id);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
      <ArticleForm
        articleId={article.id}
        defaultTitle={article.title}
        defaultContent={article.content}
        heading="게시글 수정"
        submitLabel="수정"
      />
    </div>
  );
}
