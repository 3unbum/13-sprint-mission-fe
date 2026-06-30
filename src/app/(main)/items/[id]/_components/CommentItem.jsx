"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment, deleteComment } from "@/lib/api";
import Avatar from "@/components/common/Avatar";
import KebabMenu from "@/components/common/KebabMenu";
import { useAuth } from "@/providers/AuthProvider";
import { formatTimeAgo } from "@/lib/formatDate";

export default function CommentItem({ comment, productId }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);

  // 내 댓글일 때만 케밥 노출
  const isMine = user?.id === comment.writer?.id;

  // 공통 : 성공 시 댓글 목록 갱신
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["comments", productId] });

  // 수정 -> 성공 시 수정모드 종료 + 목록 갱신
  const updateMutation = useMutation({
    mutationFn: () => updateComment(comment.id, draft.trim()),
    onSuccess: () => {
      setIsEditing(false);
      invalidate();
    },
    onError: (err) => alert(err.message),
  });

  // 삭제
  const deleteMutation = useMutation({
    mutationFn: () => deleteComment(comment.id),
    onSuccess: invalidate,
    onError: (err) => alert(err.message),
  });

  return (
    <li className="border-b border-gray-200 pb-6">
      {isEditing ? (
        // 수정 모드
        <>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-800 outline-none"
          />
          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setDraft(comment.content); // 원복
                setIsEditing(false);
              }}
              className="text-sm font-semibold text-gray-500"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => updateMutation.mutate()}
              disabled={!draft.trim() || updateMutation.isPending}
              className="rounded-lg bg-brand-blue px-4 py-1.5 text-sm font-semibold text-white disabled:bg-gray-400"
            >
              수정 완료
            </button>
          </div>
        </>
      ) : (
        // 일반 모드
        <>
          <div className="flex items-start justify-between">
            <p className="text-sm text-gray-800">{comment.content}</p>
            {isMine && (
              <KebabMenu>
                <li
                  onClick={() => setIsEditing(true)}
                  className="cursor-pointer py-3 hover:bg-gray-50"
                >
                  수정하기
                </li>
                <li
                  onClick={() => deleteMutation.mutate()}
                  className="cursor-pointer py-3 hover:bg-gray-50"
                >
                  삭제하기
                </li>
              </KebabMenu>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Avatar size={32} />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-600">
                {comment.writer?.nickname}
              </span>
              <span className="text-xs text-gray-400">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>
          </div>
        </>
      )}
    </li>
  );
}
