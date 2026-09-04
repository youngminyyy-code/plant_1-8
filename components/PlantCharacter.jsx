import { commentTier } from "../lib/plants";

const STAGE_LABELS = [
  "심은 지 얼마 안 됐어요",
  "새싹이 났어요",
  "쑥쑥 자라는 중",
  "잎이 무성해요",
  "봉오리가 맺혔어요",
  "활짝 자랐어요!",
];

const POT_THEME = {
  basil: {
    rimTop: "#a8e6a1",
    rimBottom: "#6cc56f",
    potTop: "#7bc47a",
    potBottom: "#4c9a5c",
    stroke: "#2f6b3a",
    leafTop: "#8fe08a",
    leafBottom: "#4c9a5c",
    leafStroke: "#2f6b3a",
  },
  tomato: {
    rimTop: "#ff9d8f",
    rimBottom: "#e0574a",
    potTop: "#f4746a",
    potBottom: "#c0392b",
    stroke: "#8a2a1f",
    leafTop: "#8bc76a",
    leafBottom: "#3f7a46",
    leafStroke: "#2a5c30",
  },
};

function Defs({ id, theme }) {
  return (
    <defs>
      <linearGradient id={`pc-rim-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={theme.rimTop} />
        <stop offset="100%" stopColor={theme.rimBottom} />
      </linearGradient>
      <linearGradient id={`pc-pot-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={theme.potTop} />
        <stop offset="100%" stopColor={theme.potBottom} />
      </linearGradient>
      <radialGradient id={`pc-soil-${id}`} cx="50%" cy="25%" r="75%">
        <stop offset="0%" stopColor="#6b4a34" />
        <stop offset="100%" stopColor="#432c1f" />
      </radialGradient>
      <linearGradient id={`pc-stem-${id}`} x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#3f8a4d" />
        <stop offset="100%" stopColor="#6cc56f" />
      </linearGradient>
      <linearGradient id={`pc-leaf-${id}`} x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor={theme.leafBottom} />
        <stop offset="100%" stopColor={theme.leafTop} />
      </linearGradient>
      <radialGradient id={`pc-tomato-${id}`} cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#ff8a75" />
        <stop offset="100%" stopColor="#d63a2b" />
      </radialGradient>
      <radialGradient id={`pc-flower-${id}`} cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#d9c9f2" />
      </radialGradient>
      <radialGradient id={`pc-glow-${id}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffe28a" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#ffe28a" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

function Leaf({ id, theme, x, y, rotate, scale = 1, jagged = false }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      {jagged ? (
        <path
          d="M0,0 C-8,-4 -12,-9 -9,-13 C-11,-15 -9,-17 -6,-15 C-6,-18 -2,-20 0,-17 C2,-20 6,-18 6,-15 C9,-17 11,-15 9,-13 C12,-9 8,-4 0,0 Z"
          fill={`url(#pc-leaf-${id})`}
          stroke={theme.leafStroke}
          strokeWidth="1"
        />
      ) : (
        <path
          d="M0,0 C -9,-6 -12,-17 0,-23 C 12,-17 9,-6 0,0 Z"
          fill={`url(#pc-leaf-${id})`}
          stroke={theme.leafStroke}
          strokeWidth="1"
        />
      )}
      <path d="M0,-2 L0,-17" stroke={theme.leafStroke} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </g>
  );
}

function StarFlower({ x, y, scale = 1, color = "#ffd35c" }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M0,-8 L2.2,-2.2 L8,0 L2.2,2.2 L0,8 L-2.2,2.2 L-8,0 L-2.2,-2.2 Z"
      fill={color}
      stroke="#e0a336"
      strokeWidth="0.6"
    />
  );
}

function Tomato({ id, x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle r="8" fill={`url(#pc-tomato-${id})`} stroke="#a4271c" strokeWidth="0.8" />
      <circle cx="-2.5" cy="-3" r="1.8" fill="#ffffff" opacity="0.5" />
      <path
        d="M0,-8 L-2,-11 L0,-10 L0,-12 L2,-10 L2,-11 Z"
        fill="#4c9a5c"
        stroke="#2f6b3a"
        strokeWidth="0.4"
      />
    </g>
  );
}

function FlowerSpike({ id, x, y }) {
  // 바질 꽃대 (작은 꽃들이 줄지어 피는 모양)
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0,10 L0,-26" stroke={`url(#pc-stem-${id})`} strokeWidth="3" strokeLinecap="round" />
      {[-4, 2, -10, 8, -16].map((dy, i) => (
        <g key={i} transform={`translate(${i % 2 === 0 ? -4 : 4} ${dy - 4})`}>
          <circle r="3.4" fill={`url(#pc-flower-${id})`} stroke="#c9b3e8" strokeWidth="0.5" />
        </g>
      ))}
    </g>
  );
}

// 화분에 그려지는 표정. 댓글 수에 따라 무표정 -> 미소 -> 밝은 미소 -> 활짝+반짝임 으로 바뀌어요.
function Face({ tier }) {
  const smile = [
    "M90,192 L110,192", // 0: 무표정
    "M90,190 Q100,196 110,190", // 1: 살짝 미소
    "M88,188 Q100,201 112,188", // 2: 밝은 미소
    "M85,186 Q100,206 115,186", // 3: 활짝 미소
  ][tier];

  const blush = tier >= 2;

  return (
    <g>
      <circle cx="86" cy="178" r="5" fill="#2b2b2b" />
      <circle cx="114" cy="178" r="5" fill="#2b2b2b" />
      <circle cx="84.3" cy="176.3" r="1.6" fill="#ffffff" />
      <circle cx="112.3" cy="176.3" r="1.6" fill="#ffffff" />
      {blush && (
        <>
          <ellipse cx="76" cy="187" rx="6.5" ry="4.5" fill="#ff9fb0" opacity="0.55" />
          <ellipse cx="124" cy="187" rx="6.5" ry="4.5" fill="#ff9fb0" opacity="0.55" />
        </>
      )}
      <path d={smile} fill="none" stroke="#2b2b2b" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}

function Sparkle({ x, y, scale = 1, opacity = 0.9 }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M0,-6 L1.6,-1.6 L6,0 L1.6,1.6 L0,6 L-1.6,1.6 L-6,0 L-1.6,-1.6 Z"
      fill="#fff3c4"
      opacity={opacity}
    />
  );
}

function Pot({ id, theme, tier }) {
  return (
    <g>
      {tier === 3 && <circle cx="100" cy="150" r="95" fill={`url(#pc-glow-${id})`} />}
      <ellipse cx="100" cy="216" rx="44" ry="7" fill="#2f6b3a" opacity="0.15" />
      <path
        d="M58,156 L142,156 L131,207 C130,211 126,214 122,214 L78,214 C74,214 70,211 69,207 Z"
        fill={`url(#pc-pot-${id})`}
        stroke={theme.stroke}
        strokeWidth="3"
      />
      <rect x="50" y="140" width="100" height="18" rx="9" fill={`url(#pc-rim-${id})`} stroke={theme.stroke} strokeWidth="2.5" />
      <ellipse cx="100" cy="150" rx="42" ry="8" fill={`url(#pc-soil-${id})`} />
      <ellipse cx="84" cy="149" rx="4" ry="1.6" fill="#2f1d13" opacity="0.5" />
      <ellipse cx="116" cy="151" rx="5" ry="1.8" fill="#2f1d13" opacity="0.5" />
      <Face tier={tier} />
      {tier === 3 && (
        <>
          <Sparkle x={44} y={130} scale={0.7} opacity={0.85} />
          <Sparkle x={158} y={135} scale={0.6} opacity={0.8} />
          <Sparkle x={100} y={100} scale={0.55} opacity={0.75} />
        </>
      )}
    </g>
  );
}

const LEAF_SETS = {
  1: [
    { x: 92, y: 141, rotate: -35, scale: 0.55 },
    { x: 108, y: 141, rotate: 35, scale: 0.55 },
  ],
  2: [
    { x: 88, y: 138, rotate: -35, scale: 0.7 },
    { x: 112, y: 138, rotate: 35, scale: 0.7 },
    { x: 90, y: 119, rotate: -25, scale: 0.6 },
    { x: 110, y: 119, rotate: 25, scale: 0.6 },
  ],
  3: [
    { x: 84, y: 140, rotate: -38, scale: 0.85 },
    { x: 116, y: 140, rotate: 38, scale: 0.85 },
    { x: 82, y: 119, rotate: -30, scale: 0.75 },
    { x: 118, y: 119, rotate: 30, scale: 0.75 },
    { x: 88, y: 99, rotate: -20, scale: 0.6 },
    { x: 112, y: 99, rotate: 20, scale: 0.6 },
  ],
};
LEAF_SETS[4] = LEAF_SETS[3];
LEAF_SETS[5] = LEAF_SETS[3];

const STEM_TOP = { 0: 150, 1: 138, 2: 118, 3: 96, 4: 82, 5: 74 };

function Stem({ id, stage }) {
  if (stage === 0) return null;
  return (
    <path
      d={`M100,152 C100,${(152 + STEM_TOP[stage]) / 2} 98,${STEM_TOP[stage] + 6} 100,${STEM_TOP[stage]}`}
      fill="none"
      stroke={`url(#pc-stem-${id})`}
      strokeWidth={stage <= 1 ? 5 : 7}
      strokeLinecap="round"
    />
  );
}

function Plant({ id, theme, species, stage }) {
  const leaves = LEAF_SETS[stage] ?? [];
  const jagged = species === "tomato";

  return (
    <g>
      <Stem id={id} stage={stage} />
      {leaves.map((l, i) => (
        <Leaf key={i} id={id} theme={theme} jagged={jagged} {...l} />
      ))}

      {stage === 0 && <circle cx="100" cy="148" r="3" fill="#7a5a3c" />}

      {stage === 4 &&
        (species === "basil" ? (
          <FlowerSpike id={id} x={100} y={82} />
        ) : (
          <>
            <StarFlower x={92} y={78} scale={0.8} />
            <StarFlower x={110} y={84} scale={0.7} />
          </>
        ))}

      {stage === 5 &&
        (species === "basil" ? (
          <FlowerSpike id={id} x={100} y={74} />
        ) : (
          <>
            <Tomato id={id} x={92} y={82} scale={1} />
            <Tomato id={id} x={112} y={92} scale={0.85} />
            <Tomato id={id} x={100} y={68} scale={0.75} />
            <StarFlower x={122} y={78} scale={0.7} />
          </>
        ))}
    </g>
  );
}

export default function PlantCharacter({
  species = "basil",
  stage = 0,
  commentCount = 0,
  size = 220,
}) {
  const clampedStage = Math.min(5, Math.max(0, stage));
  const tier = commentTier(commentCount);
  const theme = POT_THEME[species] ?? POT_THEME.basil;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg viewBox="0 0 200 224" width={size} height={size * 1.12}>
        <Defs id={species} theme={theme} />
        <Plant id={species} theme={theme} species={species} stage={clampedStage} />
        <Pot id={species} theme={theme} tier={tier} />
      </svg>
      <div style={{ fontWeight: 600, color: "#2f6b3a", textAlign: "center" }}>
        {clampedStage}단계 · {STAGE_LABELS[clampedStage]}
      </div>
    </div>
  );
}
