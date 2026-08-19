import Link from "next/link";

const SOCIALS = [
  {
    name: "facebook",
    href: "https://www.facebook.com",
    icon: "/icons/social/ic_facebook.svg",
  },
  {
    name: "twitter",
    href: "https://twitter.com",
    icon: "/icons/social/ic_twitter.svg",
  },
  {
    name: "youtube",
    href: "https://www.youtube.com",
    icon: "/icons/social/ic_youtube.svg",
  },
  {
    name: "instagram",
    href: "https://www.instagram.com",
    icon: "/icons/social/ic_instagram.svg",
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
        {/* 모바일: 세로 2줄 (윗줄=메뉴+소셜, 아랫줄=copyright) / 데스크탑 : 한 줄 */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="order-last text-sm text-gray-400 md:order-first">
            ©codeit - 2024
          </p>

          {/* 모바일: 메뉴와 소셜이 한 줄에 좌우로 / 데스크탑: 자연 배치 */}
          <div className="flex items-center justify-between md:contents">
            <nav className="flex gap-8 text-sm">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/faq">FAQ</Link>
            </nav>

            <ul className="flex gap-3">
              {SOCIALS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={social.icon}
                      alt={social.name}
                      className="h-6 w-6"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
