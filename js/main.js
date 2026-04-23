import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
} from "./ArticleService.js";
import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
} from "./ProductService.js";

// Article
getArticleList(1, 10, "").then((res) => console.log("[getArticleList]", res));

createArticle("제목", "내용", "https://example.com/image.png").then(
  (article) => {
    console.log("[createArticle]", article);
    getArticle(article.id).then((res) => console.log("[getArticle]", res));
    patchArticle(article.id, { title: "수정된 제목" }).then((res) =>
      console.log("[patchArticle]", res),
    );
    deleteArticle(article.id).then(() =>
      console.log("[deleteArticle] id:", article.id),
    );
  },
);

// Product
getProductList(1, 10, "").then((res) => console.log("[getProductList]", res));

const product = await createProduct(
  "상품",
  "설명",
  10000,
  ["샘플"],
  ["https://example.com/product.png"],
);
console.log("[createProduct]", product);
console.log("[getProduct]", await getProduct(product.id));
console.log("[patchProduct]", await patchProduct(product.id, { price: 12000 }));
await deleteProduct(product.id);
console.log("[deleteProduct] id:", product.id);
