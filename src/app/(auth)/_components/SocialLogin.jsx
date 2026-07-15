import Image from "next/image";

// 로그인/회원가입 공통 간편 로그인 블록.
// signin/signup 어느 쪽에도 의존하지 않는 순수 뷰라 별도 컴포넌트로 분리.
export default function SocialLogin() {
  return (
    <div className="mt-6 flex w-full max-w-[343px] items-center justify-between rounded-lg bg-[#e6f2ff] px-6 py-4 md:max-w-[640px]">
      <span className="text-base font-medium text-gray-900">간편 로그인하기</span>
      <div className="flex gap-4">
        <a
          href="https://www.google.com"
          target="_blank"
          rel="noreferrer"
          aria-label="구글로 로그인"
          className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white"
        >
          <Image
            src="/icons/auth/ic_google.svg"
            alt="Google"
            width={24}
            height={24}
          />
        </a>
        <a
          href="https://www.kakaocorp.com/page"
          target="_blank"
          rel="noreferrer"
          aria-label="카카오로 로그인"
          className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#fee500]"
        >
          <Image
            src="/icons/auth/ic_kakao.svg"
            alt="Kakao"
            width={24}
            height={24}
          />
        </a>
      </div>
    </div>
  );
}
