// 백엔드가 닉네임/좋아요를 안 주므로 프론트에서 생성.
// id 기반이라 같은 글은 항상 같은 값 (새로고침해도 안 바뀜)
const NICKNAMES = [
  "총명한 판다",
  "행복한 너구리",
  "용감한 다람쥐",
  "느긋한 곰",
  "엉뚱한 여우",
];

export function withFake(article) {
  return {
    ...article,
    nickname: NICKNAMES[article.id % NICKNAMES.length],
    likeCount: (article.id * 37) % 9999, // id로 흩뿌린 값
  };
}

export function withFakeComment(comment) {
  return {
    ...comment,
    nickname: NICKNAMES[comment.id % NICKNAMES.length],
  };
}
