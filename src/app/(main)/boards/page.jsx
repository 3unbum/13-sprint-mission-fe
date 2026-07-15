import { getArticles } from "@/lib/api";
import ArticleList from "./_components/ArticleList";
import SearchBar from "./_components/SearchBar";
import SortDropdown from "./_components/SortDropdown";
import Link from "next/link";
import BestPosts from "@/app/(main)/boards/_components/BestPosts";

// 서버 컴포넌트 - searchParams를 받아 목록을 fetch한다.
export default async function BoardsPage({ searchParams }) {
  const { keyword = "", sort = "recent" } = await searchParams;

  const { list, totalCount } = await getArticles({
    keyword,
    orderBy: sort,
  });
  

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
      <BestPosts />
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">게시글</h2>
        <Link
          href="/boards/write"
          className="flex h-11 items-center rounded-lg bg-brand-blue px-6 text-base font-semibold text-white"
        >
          글쓰기
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <SearchBar />
        <SortDropdown />
      </div>

      <ArticleList articles={list} />

      <p className="mt-4 text-sm text-gray-400">총 {totalCount}개</p>
    </div>
  );
}
