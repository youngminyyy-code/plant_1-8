import { faceTier } from "../lib/plants";

const STAGE_LABELS = [
  "심은 지 얼마 안 됐어요",
  "새싹이 났어요",
  "쑥쑥 자라는 중",
  "잎이 무성해요",
  "봉오리가 맺혔어요",
  "활짝 자랐어요!",
];

// 캐릭터 이미지(700x800 캔버스) 기준 화분 중심 좌표
// 모든 단계에서 화분이 거의 같은 자리에 있어서 고정 좌표를 써도 잘 맞아요.
const POT_CENTER_X = 350;
const POT_TOP_Y = 650;
const EYE_Y = POT_TOP_Y + 55;
const EYE_DX = 42;
const MOUTH_Y = POT_TOP_Y + 78;

function Sparkle({ x, y, scale = 1, opacity = 0.9 }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M0,-14 L4,-4 L14,0 L4,4 L0,14 L-4,4 L-14,0 L-4,-4 Z"
      fill="#fff3c4"
      opacity={opacity}
    />
  );
}

// 화분 위에 그려지는 표정. 댓글 수가 아니라 "이야기(글) 수"에 따라
// 무표정 -> 미소 -> 밝은 미소 -> 활짝+반짝임 순으로 바뀌어요.
function Face({ tier }) {
  const mouthPaths = [
    `M${POT_CENTER_X - 22},${MOUTH_Y} L${POT_CENTER_X + 22},${MOUTH_Y}`,
    `M${POT_CENTER_X - 22},${MOUTH_Y - 4} Q${POT_CENTER_X},${MOUTH_Y + 10} ${POT_CENTER_X + 22},${MOUTH_Y - 4}`,
    `M${POT_CENTER_X - 26},${MOUTH_Y - 6} Q${POT_CENTER_X},${MOUTH_Y + 16} ${POT_CENTER_X + 26},${MOUTH_Y - 6}`,
    `M${POT_CENTER_X - 30},${MOUTH_Y - 8} Q${POT_CENTER_X},${MOUTH_Y + 22} ${POT_CENTER_X + 30},${MOUTH_Y - 8}`,
  ];

  const blush = tier >= 2;

  return (
    <g>
      {tier === 3 && (
        <circle cx={POT_CENTER_X} cy={POT_TOP_Y + 60} r="180" fill="url(#pc-glow)" />
      )}

      <circle cx={POT_CENTER_X - EYE_DX} cy={EYE_Y} r="11" fill="#2b2b2b" />
      <circle cx={POT_CENTER_X + EYE_DX} cy={EYE_Y} r="11" fill="#2b2b2b" />
      <circle cx={POT_CENTER_X - EYE_DX - 3.5} cy={EYE_Y - 3.5} r="3.5" fill="#ffffff" />
      <circle cx={POT_CENTER_X + EYE_DX - 3.5} cy={EYE_Y - 3.5} r="3.5" fill="#ffffff" />

      {blush && (
        <>
          <ellipse cx={POT_CENTER_X - 66} cy={EYE_Y + 22} rx="14" ry="9" fill="#ff9fb0" opacity="0.55" />
          <ellipse cx={POT_CENTER_X + 66} cy={EYE_Y + 22} rx="14" ry="9" fill="#ff9fb0" opacity="0.55" />
        </>
      )}

      <path
        d={mouthPaths[tier]}
        fill="none"
        stroke="#2b2b2b"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {tier === 3 && (
        <>
          <Sparkle x={POT_CENTER_X - 160} y={POT_TOP_Y - 40} scale={0.9} />
          <Sparkle x={POT_CENTER_X + 170} y={POT_TOP_Y - 20} scale={0.7} opacity={0.8} />
          <Sparkle x={POT_CENTER_X + 40} y={POT_TOP_Y - 130} scale={0.6} opacity={0.75} />
        </>
      )}
    </g>
  );
}

export default function PlantCharacter({
  species = "basil",
  stage = 0,
  storyCount = 0,
  size = 220,
}) {
  const clampedStage = Math.min(5, Math.max(0, stage));
  const tier = faceTier(storyCount);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: size, height: (size * 800) / 700 }}>
        <img
          src={`/characters/${species}-${clampedStage}.png`}
          alt={`${species} 단계 ${clampedStage}`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
        />
        <svg
          viewBox="0 0 700 800"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <defs>
            <radialGradient id="pc-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe28a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ffe28a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <Face tier={tier} />
        </svg>
      </div>
      <div style={{ fontWeight: 600, color: "#2f6b3a", textAlign: "center" }}>
        {clampedStage}단계 · {STAGE_LABELS[clampedStage]}
      </div>
    </div>
  );
}
