"use client";

// 페이지네이션 - 현재 페이지 주변 번호 + 이전/다음 버튼
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null; // 페이지가 1개뿐이라면 안 보여줌

  // 현재 페이지 주변 최대 5개만 노출 (예: 3 4 [5] 6 7)
  const PER_GROUP = 5;
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + PER_GROUP - 1);
  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  const baseBtnStyle =
    "flex h-10 w-10 items-center justify-center rounded-full text-base font-semibold disabled:opacity-30";

  return (
    <nav className="mt-10 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={`${baseBtnStyle} border border-gray-200 text-gray-600`}
      >
        {"<"}
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`${baseBtnStyle} ${
            p === page
              ? "bg-brand-blue text-white"
              : "border border-gray-200 text-gray-600"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className={`${baseBtnStyle} border border-gray-200 text-gray-600`}
      >
        {">"}
      </button>
    </nav>
  );
}
