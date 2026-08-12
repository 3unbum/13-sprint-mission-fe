"use client";

import { useState } from "react";
import { createComment } from "@/lib/api.js";

// 댓글 작성 폼. client에서 집적 API 호출 (토큰은 localStorage에 있으므로)
export default function CommentForm({ articleId, onAdd }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await createComment(articleId, content.trim());
      onAdd(created); // 부모 state에 추가 -> 즉시 화면 반영
      setContent("");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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
          disabled={!content.trim() || isSubmitting}
          className="h-11 rounded-lg bg-brand-blue px-6 text-base font-semibold text-white disabled:bg-gray-400"
        >
          등록
        </button>
      </div>
    </form>
  );
}
