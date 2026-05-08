import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../api/products.js";
import styles from "./RegistrationPage.module.css";

export default function RegistrationPage() {
  // 4개 input의 값을 객체 하나로 묶어서 관리.
  // useState 4개 따로 만드는 것보다 한 번에 다루기 편함.
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    tags: "",
  });

  // 제출 중인지 표시 (중복 클릭 방지 + UX)
  const [submitting, setSubmitting] = useState(false);

  // 페이지 이동용 hook (등록 후 상세 페지이로)
  const navigate = useNavigate();

  // 모든 input의 onChange를 하나로 처리.
  // e.target.name (input의 name속성)을 키로 사용해서 해당 필드만 갱신.
  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault(); //form의 기본 새로고침 동작 막기

    if (submitting) return; // 중복 제출 방지
    setSubmitting(true);

    try {
      // 태그 변환: "의류, 신품" 문자열 -> ["의류","신품"] 배열
      const tagsArray = values.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean); // 빈 문자열 제거

      const newProduct = await createProduct({
        name: values.name,
        description: values.description,
        price: Number(values.price), //input의 value는 항상 문자열이라 숫자로 변환
        tags: tagsArray,
      });

      //등록 성공 -> 해당 상품 상세 페이지로 이동
      navigate(`/product/${newProduct._id}`);
    } catch (err) {
      console.error(err);
      alert(err.message); // 임시 에러 표시. 심화에서 좀 더 다믐을 수도.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* 헤더는 form안으로 이동 - submit 버튼이 form의 일부이도록 */}
          <div className={styles.header}>
            <h1 className={styles.title}>상품 등록하기</h1>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting}
            >
              등록
            </button>
          </div>

          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              상품명
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={styles.input}
              placeholder="상품명을 입력해주세요"
              value={values.name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              상품 소개
            </label>
            <textarea
              id="description"
              name="description"
              className={`${styles.input} ${styles.textarea}`}
              placeholder="상품 소개를 입력해주세요"
              value={values.description}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="price" className={styles.label}>
              판매가격
            </label>
            <input
              id="price"
              name="price"
              type="number"
              className={styles.input}
              placeholder="판매 가격을 입력해주세요"
              value={values.price}
              onChange={handleChange}
            />
          </div>

          {/* 태그 (기본은 그냥 input. 심화에서 칩으로 확장) */}
          <div className={styles.field}>
            <label htmlFor="tags" className={styles.label}>
              태그
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              className={styles.input}
              placeholder="태그를 입력해주세요"
              value={values.tags}
              onChange={handleChange}
            />
          </div>
        </form>
      </div>
    </main>
  );
}
