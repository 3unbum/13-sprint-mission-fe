"use client";

import { useState } from "react";
import { createCommentAction } from "../actions";

// 댓글 작성 폼 (client - 등록 버튼 활성/비활성 + 등록 후 입력창 비우기)
export default function CommentForm({ articleId }) {
  const [content, setContent] = useState("");

  // articleId를 액션의 첫 인자로 미리 묶는다 (FormData는 React가 뒤에 붙임)
  const action = createCommentAction.bind(null, articleId);

  async function handleAction(formData) {
    await action(formData);
    setContent(""); // 등록 성공 후 입력창 비우기
  }

  return (
    <form action={handleAction}>
      <textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력해주세요."
        className="h-24 w-full resize-none rounded-lg bg-gray-100 px-6 py-4 text-base text-gray-800 placeholder:text-gray-400"
      />
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={!content.trim()}
          className="h-11 rounded-lg bg-brand-blue px-6 text-base font-semibold text-white disabled:bg-gray-400"
        >
          등록
        </button>
      </div>
    </form>
  );
}
