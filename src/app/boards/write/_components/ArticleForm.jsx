"use client";

import { useState } from "react";
import { createArticleAction } from "@/app/boards/write/actions";

// 게시글 등록 폼 (client - 등록 버튼 활성/비활성 토글 때문)
export default function ArticleForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const isValid = title.trim() && content.trim();

  return (
    <form action={createArticleAction}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">게시글 쓰기</h2>
        <button
          type="submit"
          disabled={!isValid}
          className="h-11 rounded-lg bg-brand-blue px-6 text-base font-semibold text-white disabled:bg-gray-400"
        >
          등록
        </button>
      </div>

      <label className="mb-3 block text-lg font-bold text-gray-900">
        *제목
      </label>
      <input
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력해주세요"
        className="mb-6 h-14 w-full rounded-xl bg-gray-100 px-6 text-base text-gray-800 placeholder:text-gray-400"
      />

      <label className="mb-3 block text-lg font-bold text-gray-900">
        *내용
      </label>
      <textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용을 입력해주세요"
        className="h-72 w-full resize-none rounded-xl bg-gray-100 px-6 py-6 text-base text-gray-800 placeholder:text-gray-400"
      />
    </form>
  );
}
