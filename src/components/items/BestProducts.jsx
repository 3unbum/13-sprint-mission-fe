import { useEffect, useState } from "react";
import { getProducts } from "../../api/products";
import ProductCard from "./ProductCard";
import styles from "./BestProducts.module.css";

// AllProducts와 패턴 동일하지만 더 단순한 버전.
// 차이점:
// - 정렬 / 검색 / 페이지네이션 없음 (그래서 state도 products 하나뿐)
// - 항상 favorite 순으로 4개만 가져옴 (고정값)
export default function BestProducts() {
  // 빈 배열로 시작. 첫 렌더 시점엔 데이터 없으니 .map()이 아무것도 안 그려서 안전.
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // pageSize 4 + orderBy "favorite" 고정 → 좋아요 많은 상위 4개.
    getProducts({ pageSize: 4, orderBy: "favorite" })
      .then((data) => setProducts(data.list))
      .catch((err) => console.error(err));
    // 의존성 빈 배열: 마운트 시 한 번만 호출. 베스트 목록은 사용자 조작에 영향 안 받음.
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>베스트 상품</h2>
      <ul className={styles.grid}>
        {products.map((product) => (
          // key={product.id}: 안정적 ID 사용 필수.
          // 빠뜨리면 React가 리스트 변경 추적 못 해서 경고 발생.
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
