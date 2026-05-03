import { useEffect, useRef, useState } from "react";
import styles from "./Dropdown.module.css";

// Dropdown은 controlled component 패턴.
// 현재 선택값(value)을 자기가 가지지 않고 부모에서 받음.
// 부모에서 state 관리 → 다른 페이지에서도 재사용 쉬움.
// React의 <input value onChange> 와 같은 구조.
export default function Dropdown({ value, onChange, options }) {
  // 메뉴가 열려있는지 여부는 자기 내부 일이라 자체 state로 관리.
  const [open, setOpen] = useState(false);

  // useRef: DOM 요소를 잡아두는 "변하지 않는 박스".
  // ref.current로 접근. useState와 달리 값이 바뀌어도 리렌더 안 일으킴.
  // 외부 클릭 감지에 필요 (드롭다운 DOM 영역을 알아야 안/밖 구분 가능).
  const ref = useRef(null);

  // 현재 선택된 옵션의 label을 보여주려고 options 배열에서 찾음.
  // 못 찾으면 undefined.
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(e) {
      // ref.current.contains(e.target): 클릭한 요소가 드롭다운 안인지 확인.
      // 밖이면 닫음.
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    // document 전체에 클릭 리스너 등록.
    // mousedown을 쓰는 이유: click보다 먼저 발생해서, 옵션 클릭 시 메뉴가 닫히기 전에 선택 처리 가능.
    document.addEventListener("mousedown", handleClickOutside);
    // cleanup: 컴포넌트 사라질 때 리스너 제거 (메모리 누수 방지).
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // 빈 배열: 마운트 시 한 번만 등록

  function handleSelect(opt) {
    onChange(opt.value); // 부모에게 새 값 알림
    setOpen(false); // 메뉴 닫기
  }

  return (
    // ref={ref}: 이 div가 바로 ref.current가 됨. 외부 클릭 판별 기준.
    <div className={styles.dropdown} ref={ref}>
      {/* type="button": 폼 안에 들어갈 수도 있어서 의도치 않은 submit 방지 */}
      <button
        type="button"
        className={styles.trigger}
        // 함수형 업데이트: 이전 값 기준으로 토글. setOpen(!open)보다 안전 (stale closure 방지).
        onClick={() => setOpen((prev) => !prev)}
      >
        {/* selected가 undefined일 수 있어서 ?. 로 안전 접근 */}
        <span>{selected?.label}</span>
        {/* aria-hidden: 스크린리더에 안 읽히게 (장식용 화살표) */}
        <span className={styles.arrow} aria-hidden="true">
          ▾
        </span>
      </button>
      {/* 조건부 렌더링: open이 true일 때만 메뉴 그림. */}
      {/* {open && (...)} 패턴은 React에서 가장 흔한 조건부 렌더 방식. */}
      {open && (
        <ul className={styles.menu}>
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={styles.option}
                onClick={() => handleSelect(opt)}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
