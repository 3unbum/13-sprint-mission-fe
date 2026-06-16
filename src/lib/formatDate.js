// ISO 날짜 -> "2026. 06. 15" 형식
export function formatDate(iso) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}. ${mm}. ${dd}`;
}
