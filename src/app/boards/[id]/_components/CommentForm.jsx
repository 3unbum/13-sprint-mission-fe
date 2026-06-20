"use client";

import { useState } from "react";
import { createCommentAction } from "../actions";

// 댓글 작성 폼. 등록 후 결과를 onAdd로 부모(CommentList)에 넘겨 목록에 즉시 반영.
export default function CommentForm({ articleId, onAdd }) {
  const [content, setContent] = useState("");

  // articleId를 액션의 첫 인자로 미리 묶는다 (FormData는 React가 뒤에 붙임)
  const action = createCommentAction.bind(null, articleId);

  async function handleAction(formData) {
    const created = await action(formData);
    if (created) {
      onAdd(created); // 부모 state에 추가 -> 즉시 화면 반영
      setContent("");
    }
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
