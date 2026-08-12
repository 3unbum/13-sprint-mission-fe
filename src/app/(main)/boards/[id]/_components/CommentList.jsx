"use client";

import { useState } from "react";
import Image from "next/image";
import CommentItem from "@/app/(main)/boards/[id]/_components/CommentItem";
import CommentForm from "@/app/(main)/boards/[id]/_components/CommentForm";
import { getComments } from "@/lib/api";

// 댓글 목록 + 등록폼 + 더보기 (client - 모든 변경을 state로 즉시 반영)
export default function CommentList({
  initialComments,
  initialCursor,
  articleId,
}) {
  const [comments, setComments] = useState(initialComments);
  const [cursor, setCursor] = useState(initialCursor);
  const [isLoading, setIsLoading] = useState(false);

  // 등록: 맨 위에 추가 / 수정: 해당 항목 교체 / 삭제: 제거
  function addComment(comment) {
    setComments((prev) => [comment, ...prev]);
  }
  function updateCommentInList(updated) {
    setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }
  function removeComment(id) {
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleLoadMore() {
    setIsLoading(true);
    try {
      const data = await getComments(articleId, { cursor, noStore: false });
      setComments((prev) => [...prev, ...data.list]);
      setCursor(data.nextCursor);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <CommentForm articleId={articleId} onAdd={addComment} />

      <div className="mt-6">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center py-20">
            <Image
              src="/images/empty-comment.png"
              alt="아직 등록된 문의가 없어요"
              width={140}
              height={140}
            />
            <p className="mt-6 text-center text-sm text-gray-400">
              아직 댓글이 없어요,
              <br />
              지금 댓글을 달아보세요!
            </p>
          </div>
        ) : (
          <ul>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onUpdate={updateCommentInList}
                onRemove={removeComment}
              />
            ))}
          </ul>
        )}

        {cursor && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoading}
              className="h-11 rounded-lg border border-gray-300 px-6 text-base font-semibold text-gray-600 disabled:opacity-50"
            >
              {isLoading ? "불러오는 중..." : "더보기"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
