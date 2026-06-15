import Link from "next/link";

const SOCIALS = [
  {
    name: "facebook",
    href: "https://www.facebook.com",
    icon: "/icons/ic_facebook.svg",
  },
  {
    name: "twitter",
    href: "https://twitter.com",
    icon: "/icons/ic_twitter.svg",
  },
  {
    name: "youtube",
    href: "https://www.youtube.com",
    icon: "/icons/ic_youtube.svg",
  },
  {
    name: "instagram",
    href: "https://www.instagram.com",
    icon: "/icons/ic_instagram.svg",
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-8 md:px-6">
        <p className="text-sm text-gray-400">©codeit - 2024</p>

        <nav className="flex gap-8 text-sm">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/faq">FAQ</Link>
        </nav>

        <ul className="flex gap-3">
          {SOCIALS.map((social) => (
            <li key={social.name}>
              <a href={social.href} target="_blank" rel="noopener noreferrer">
                <img src={social.icon} alt={social.name} className="h-6 w-6" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
