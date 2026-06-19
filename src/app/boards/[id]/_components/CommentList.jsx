import CommentItem from "@/app/boards/[id]/_components/CommentItem";
import Image from "next/image";

// 댓글 목록 (서버 컴포넌트)
export default function CommentList({ comments, articleId }) {
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
    <ul>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} articleId={articleId} />
      ))}
    </ul>
  );
}
