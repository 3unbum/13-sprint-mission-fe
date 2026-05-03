import icFacebook from "../../assets/icons/ic_facebook.svg";
import icTwitter from "../../assets/icons/ic_twitter.svg";
import icYoutube from "../../assets/icons/ic_youtube.svg";
import icInstagram from "../../assets/icons/ic_instagram.svg";
import styles from "./Footer.module.css";

// 소셜 데이터를 배열로 분리 → JSX는 .map()으로 깔끔하게 반복.
// 만약 페이스북, 트위터를 각각 <li>로 4번 직접 쓰면 중복 코드.
// 나중에 추가/수정할 때도 배열만 바꾸면 됨.
const SOCIALS = [
  { href: "https://www.facebook.com", icon: icFacebook, alt: "페이스북" },
  { href: "https://www.twitter.com", icon: icTwitter, alt: "트위터" },
  { href: "https://www.youtube.com", icon: icYoutube, alt: "유튜브" },
  { href: "https://www.instagram.com", icon: icInstagram, alt: "인스타그램" },
];

export default function Footer() {
  return (
    // <footer>: 페이지/섹션의 바닥글 영역 시맨틱 태그.
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* &copy; = © 기호 (HTML 엔티티) */}
        <div className={styles.copyright}>&copy;codeit - 2024</div>
        <div className={styles.links}>
          <a href="#">Privacy Policy</a>
          <a href="#">FAQ</a>
        </div>
        <ul className={styles.socials}>
          {SOCIALS.map((s) => (
            // key는 alt 사용 (배열 안에서 유일).
            <li key={s.alt}>
              {/* target="_blank": 새 탭에서 열기.
                  rel="noopener noreferrer": 새 탭이 부모 페이지 정보에 접근 못하게 차단 (보안 + 성능).
                  외부 링크 열 때 거의 항상 같이 사용. */}
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                <img src={s.icon} alt={s.alt} className={styles.socialIcon} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
