import Image from "next/image";

// 기본 프로필 아바타 (백엔드가 프로필 이미지를 안 줘서 고정 이미지)
export default function Avatar({ size = 24 }) {
  return (
    <Image
      src="/images/profile.png"
      alt="프로필 이미지"
      width={size}
      height={size}
      className="rounded-full"
    />
  );
}
