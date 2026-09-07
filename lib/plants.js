export const PLANTS = [
  {
    id: "basil",
    name: "바조",
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

// 화분 표정 단계 (0: 무표정 ~ 3: 활짝 웃음+반짝임). 그 식물에 올라온 "이야기 수"로 결정돼요.
export function faceTier(storyCount) {
  if (storyCount <= 0) return 0;
  if (storyCount <= 3) return 1;
  if (storyCount <= 10) return 2;
  return 3;
}

// 5단계 공용 티어 (0~4). 댓글 수 -> 원 크기, 공감 수 -> 원 선명도에 사용해요.
export function fiveTier(count) {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

export const REACTION_EMOJIS = ["👍", "❤️", "🌱", "👏", "😍"];
