import { getArticle } from "@/lib/api";
import ArticleForm from "@/app/boards/write/_components/ArticleForm";
import { updateArticleAction } from "@/app/boards/[id]/edit/actions";

// 게시글 수정 페이지 (서버 컴포넌트 - 기존 글을 받아 폼에 prefill)
export default async function EditPage({ params }) {
  const { id } = await params;
  const article = await getArticle(id);

  // id를 액션에 미리 묶는다 (폼은 title•content만 넘김)
  const action = updateArticleAction.bind(null, id);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
      <ArticleForm
        action={action}
        defaultTitle={article.title}
        defaultContent={article.content}
        heading="게시글 수정"
        submitLabel="수정"
      />
    </div>
  );
}
