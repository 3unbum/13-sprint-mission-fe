import ArticleForm from "@/app/(main)/boards/write/_components/ArticleForm";

// 게시글 등록 페이지 (서버 컴포넌트 - 폼만 배치)
export default function WritePage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
      <ArticleForm />
    </div>
  );
}
