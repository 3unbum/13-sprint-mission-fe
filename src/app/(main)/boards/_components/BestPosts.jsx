import { getBestArticles } from "@/lib/api";
import BestPostCard from "@/app/(main)/boards/_components/BestPostCard";

// 베스트 게시글 묶음 (서버 컴포넌트) - 좋아요 많은 순 상위 3개
export default async function BestPosts() {
  const best = await getBestArticles();

  if (best.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900">베스트 게시글</h2>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {best.map((article) => (
          <BestPostCard key={article.id} article={article} />
        ))}
      </ul>
    </section>
  );
}
