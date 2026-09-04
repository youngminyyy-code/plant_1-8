// 로컬 타임존 기준으로 "YYYY-MM-DD" 문자열을 만들어요 (UTC 변환으로 인한 날짜 밀림 방지)
export function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayString() {
  return toDateString(new Date());
}

// "YYYY-MM-DD" 문자열에 일 수를 더하고 다시 "YYYY-MM-DD"로 반환
export function addDays(dateString, amount) {
  const [y, m, d] = dateString.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + amount);
  return toDateString(date);
}

// 선택한 날짜(하루)의 시작/끝 시각을 ISO 문자열로 반환 (Supabase 쿼리용)
export function dayRange(dateString) {
  const [y, m, d] = dateString.split("-").map(Number);
  const start = new Date(y, m - 1, d, 0, 0, 0, 0);
  const end = new Date(y, m - 1, d + 1, 0, 0, 0, 0);
  return { startISO: start.toISOString(), endISO: end.toISOString() };
}

export function formatDisplayDate(dateString) {
  const [y, m, d] = dateString.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}
