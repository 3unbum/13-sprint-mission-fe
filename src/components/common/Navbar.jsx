"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "자유게시판", href: "/boards" },
  { label: "중고마켓", href: "/items" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-100 h-[70px] w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-full max-w-[1200px] items-center gap-6 px-4 md:px-6">
        <div className="flex flex-1 items-center gap-8">
          <Link href="/boards" aria-label="판다마켓 홈으로 이동">
            {/* 모바일: 글자 로고만 / 태블릿 +: 아이콘 +글자 */}
            <Image
              src="/logo/panda-logo-typo.png"
              alt="판다마켓"
              width={80}
              height={40}
              className="md:hidden"
            />
            <Image
              src="/logo/panda-logo.png"
              alt="판다마켓"
              width={120}
              height={40}
              className="hidden md:block"
            />
          </Link>

          <nav className="flex gap-4">
            {NAV_LINKS.map((link) => {
              // 상세 (/boards/3)에서도 메뉴 활성 유지하려고 startsWith 사용
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex h-[70px] items-center px-2 text-lg font-bold ${
                    isActive ? "text-brand-blue" : "text-gray-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <Link
          href="/login"
          className="flex h-12 w-32 items-center justify-center rounded-lg bg-brand-blue text-base font-semibold text-white"
        >
          로그인
        </Link>
      </div>
    </header>
  );
}
