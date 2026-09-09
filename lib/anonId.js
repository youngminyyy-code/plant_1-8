// 이름 입력 없이도 "같은 사람이 같은 이모티콘으로 중복 공감"을 막기 위해
// 브라우저마다 하나씩 랜덤 ID를 만들어 localStorage에 저장해둬요.
export function getAnonId() {
  try {
    let id = localStorage.getItem("anonId");
    if (!id) {
      id = "anon_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("anonId", id);
    }
    return id;
  } catch {
    // localStorage를 못 쓰는 환경이면 매번 새로 생성 (중복 방지는 안 되지만 최소 동작은 함)
    return "anon_" + Math.random().toString(36).slice(2);
  }
}
