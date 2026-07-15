"use client";

// 상품 삭제 확인 모달 (시안 8532-46779: 빨강 원형 체크 + 취소/네)
export default function DeleteConfirmModal({ onCancel, onConfirm, isPending }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex w-[330px] flex-col items-center rounded-2xl bg-white px-6 py-7">
        {/* 빨강 원형 체크 아이콘 */}
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12l5 5L20 7" />
          </svg>
        </span>

        <p className="mt-4 text-base text-gray-700">
          정말로 상품을 삭제하시겠어요?
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-red-500 px-7 py-2 text-sm font-semibold text-red-500"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="rounded-lg bg-red-500 px-7 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}
