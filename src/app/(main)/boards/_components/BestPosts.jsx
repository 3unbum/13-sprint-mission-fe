import { getBestArticles } from "@/lib/api";
import { withFake } from "@/lib/fakeData";
import BestPostCard from "@/app/(main)/boards/_components/BestPostCard";

// 베스트 게시글 묶음 (서버 컴포넌트)
// 백엔드에 좋아요가 없어 가짜 likeCount 상위 3개를 뽑는다.
export default async function BestPosts() {
  const list = await getBestArticles();
  const best = list
    .map(withFake)
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 3);

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
