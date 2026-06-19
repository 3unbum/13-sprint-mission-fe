"use client";

import { useState } from "react";
import Image from "next/image";
import { formatRelative } from "@/lib/formatDate";
import KebabMenu from "@/components/common/KebabMenu";
import {
  updateCommentAction,
  deleteCommentAction,
} from "@/app/boards/[id]/actions";

// 댓글 한 개. 보기 <-> 인라인 편집 두 모드를 가져 client로 둔다.
export default function CommentItem({ comment, articleId }) {
  const [isEditing, setIsEditing] = useState(false);

  // 액션에 commentId·articleId를 미리 묶는다 (content는 폼이 넘김)
  const updateAction = updateCommentAction.bind(null, comment.id, articleId);
  const deleteAction = deleteCommentAction.bind(null, comment.id, articleId);

  async function handleUpdate(formData) {
    await updateAction(formData);
    setIsEditing(false); // 성공 후 보기 모드로
  }

  return (
    <li className="border-b border-gray-200 py-6">
      {isEditing ? (
        <form action={handleUpdate}>
          <textarea
            name="content"
            defaultValue={comment.content}
            className="h-24 w-full resize-none rounded-lg bg-gray-100 px-6 py-4 text-base text-gray-800"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="h-9 rounded-lg px-4 text-sm text-gray-500"
            >
              취소
            </button>
            <button
              type="submit"
              className="h-9 rounded-lg bg-brand-blue px-4 text-sm font-semibold text-white"
            >
              수정 완료
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <p className="whitespace-pre-wrap text-base text-gray-800">
              {comment.content}
            </p>

            <KebabMenu>
              <li>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full py-3 hover:bg-gray-50"
                >
                  수정하기
                </button>
              </li>
              <li>
                <form action={deleteAction}>
                  <button
                    type="submit"
                    className="w-full py-3 hover:bg-gray-50"
                  >
                    삭제하기
                  </button>
                </form>
              </li>
            </KebabMenu>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
            <Image
              src="/images/profile.png"
              alt=""
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-gray-600">{comment.nickname}</span>
              <span className="text-xs" suppressHydrationWarning>
                {formatRelative(comment.createdAt)}
              </span>
            </div>
          </div>
        </>
      )}
    </li>
  );
}
