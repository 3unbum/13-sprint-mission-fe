"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { getProductComments, createProductComment } from "@/lib/api";
import CommentItem from "@/app/(main)/items/[id]/_components/CommentItem";

export default function CommentSection({ productId }) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  // 댓글 목록 (cursor 페이지네이션이지만 우선 첫 페이지만)
  const { data, isPending, error } = useQuery({
    queryKey: ["comments", productId],
    queryFn: () => getProductComments(productId),
  });

  // 댓글 등록 -> 성공 시 입력 비우고 목록 갱신
  const createMutation = useMutation({
    mutationFn: () => createProductComment(productId, content.trim()),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["comments", productId] });
    },
    onError: (err) => alert(err.message),
  });

  const comments = data?.list ?? [];

  return (
    <section className="mt-10">
      {/* 입력 영역 */}
      <h2 className="text-base font-semibold text-gray-900">문의하기</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있으며, 이에 대한 민형사상 책임은 게시자에게 있습니다."
        className="mt-3 w-full resize-none rounded-xl bg-gray-100 px-6 py-4 text-base text-gray-800 outline-none placeholder:text-gray-400"
      />
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => createMutation.mutate()}
          disabled={!content.trim() || createMutation.isPending}
          className="rounded-lg bg-brand-blue px-6 py-2 text-sm font-semibold text-white disabled:bg-gray-400"
        >
          등록
        </button>
      </div>

      {/* 목록 영역 */}
      <div className="mt-8">
        {isPending && (
          <p className="py-10 text-center text-gray-400">불러오고 있어요...</p>
        )}
        {error && (
          <p className="py-10 text-center text-red-400">
            댓글을 불러오지 못했어요.
          </p>
        )}

        {!isPending && !error && comments.length === 0 && (
          // 빈 상태
          <div className="flex flex-col items-center gap-4 py-16">
            <Image
              src="/images/empty-comment.png"
              alt="아직 문의가 없어요"
              width={140}
              height={140}
            />
            <p className="text-base text-gray-400">아직 문의가 없어요</p>
          </div>
        )}

        {comments.length > 0 && (
          <ul className="flex flex-col gap-6">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                productId={productId}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
