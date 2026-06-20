"use client";

import { useState } from "react";
import Image from "next/image";
import CommentItem from "@/app/boards/[id]/_components/CommentItem";
import { getMoreComments } from "@/lib/api";
import { withFakeComment } from "@/lib/fakeData";

// 댓글 목록 + 더보기 (client - 더보기로 쌓이는 상태 때문)
export default function CommentList({
  initialComments,
  initialCursor,
  articleId,
}) {
  const [comments, setComments] = useState(
    initialComments.map(withFakeComment),
  );
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);

  async function handleLoadMore() {
    setLoading(true);
    try {
      const data = await getMoreComments(articleId, cursor);
      setComments((prev) => [...prev, ...data.list.map(withFakeComment)]);
      setCursor(data.nextCursor);
    } finally {
      setLoading(false);
    }
  }
  // 빈 상태
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center py-20">
        <Image
          src="/images/empty-comment.png"
          alt=""
          width={140}
          height={140}
        />
        <p className="mt-6 text-center text-sm text-gray-400">
          아직 댓글이 없어요,
          <br />
          지금 댓글을 달아보세요!
        </p>
      </div>
    );
  }

  return (
    <>
      <ul>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            articleId={articleId}
          />
        ))}
      </ul>

      {cursor && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loading}
            className="h-11 rounded-lg border border-gray-300 px-6 text-base font-semibold text-gray-600 disabled:opacity-50"
          >
            {loading ? "불러오는 중..." : "더보기"}
          </button>
        </div>
      )}
    </>
  );
}
