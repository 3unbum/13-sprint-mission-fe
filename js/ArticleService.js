const BASE_URL = "https://panda-market-api-crud.vercel.app";

function getArticleList(page, pageSize, keyword) {
  return fetch(
    `${BASE_URL}/articles?page=${page}&pageSize=${pageSize}&keyword=${keyword}`,
  )
    .then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .catch((err) => console.error(err));
}

function getArticle(articleId) {
  return fetch(`${BASE_URL}/articles/${articleId}`)
    .then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .catch((err) => console.error(err));
}

function createArticle(title, content, image) {
  return fetch(`${BASE_URL}/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, image }),
  })
    .then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .catch((err) => console.error(err));
}

function patchArticle(articleId, updates) {
  return fetch(`${BASE_URL}/articles/${articleId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })
    .then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .catch((err) => console.error(err));
}

function deleteArticle(articleId) {
  return fetch(`${BASE_URL}/articles/${articleId}`, { method: "DELETE" })
    .then((res) => {
      if (!res.ok) throw new Error(res.status);
    })
    .catch((err) => console.error(err));
}

export {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
};
