import ArticleListItem from "@/app/(main)/boards/_components/ArticleListItem";

// 게시글 목록 (서버 컴포넌트)
export default function ArticleList({ articles }) {
  // 빈 상태
  if (articles.length === 0) {
    return (
      <p className="py-20 text-center text-gray-400">아직 게시물이 없어요.</p>
    );
  }

  return (
    <ul>
      {articles.map((article) => (
        <ArticleListItem key={article.id} article={article} />
      ))}
    </ul>
  );
}
