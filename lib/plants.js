export const PLANTS = [
  {
    id: "basil",
    name: "바줘",
    species: "바질",
    emoji: "🌿",
  },
  {
    id: "tomato",
    name: "로베르토",
    species: "방울토마토",
    emoji: "🍅",
  },
];

export function getPlant(id) {
  return PLANTS.find((p) => p.id === id) ?? PLANTS[0];
}

// 댓글 수에 따른 표정 단계 (0: 무표정 ~ 3: 활짝 웃음 + 반짝임)
export function commentTier(commentCount) {
  if (commentCount <= 0) return 0;
  if (commentCount <= 3) return 1;
  if (commentCount <= 10) return 2;
  return 3;
}
