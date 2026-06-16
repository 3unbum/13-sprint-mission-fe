import { getArticles } from "@/lib/api";
import { withFake } from "@/lib/fakeData";
import ArticleList from "./_components/ArticleList";

// 서버 컴포넌트 - searchParams를 받아 목록을 fetch한다.
export default async function BoardsPage({ searchParams }) {
  const { keyword = "", page = "1" } = await searchParams;

  const { list, totalCount } = await getArticles({
    page: Number(page),
    keyword,
  });
  const articles = list.map(withFake);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">게시글</h2>
      </div>

      <ArticleList articles={articles} />

      <p className="mt-4 text-sm text-gray-400">총 {totalCount}개</p>
    </div>
  );
}
