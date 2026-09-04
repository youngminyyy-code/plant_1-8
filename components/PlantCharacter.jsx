const STAGE_LABELS = [
  "새싹 준비 중",
  "새싹이 났어요",
  "쑥쑥 자라는 중",
  "잎이 무성해요",
  "꽃봉오리가 맺혔어요",
  "활짝 피었어요!",
];

function Defs() {
  return (
    <defs>
      <linearGradient id="pc-rim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffc98a" />
        <stop offset="100%" stopColor="#e0975f" />
      </linearGradient>
      <linearGradient id="pc-pot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f2a468" />
        <stop offset="100%" stopColor="#c9723f" />
      </linearGradient>
      <radialGradient id="pc-soil" cx="50%" cy="25%" r="75%">
        <stop offset="0%" stopColor="#6b4a34" />
        <stop offset="100%" stopColor="#432c1f" />
      </radialGradient>
      <linearGradient id="pc-stem" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#3f8a4d" />
        <stop offset="100%" stopColor="#6cc56f" />
      </linearGradient>
      <linearGradient id="pc-leaf" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#3f8a4d" />
        <stop offset="100%" stopColor="#8fe08a" />
      </linearGradient>
      <radialGradient id="pc-petal" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#ffe3ec" />
        <stop offset="100%" stopColor="#f28aa3" />
      </radialGradient>
      <radialGradient id="pc-center" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#fff3c4" />
        <stop offset="100%" stopColor="#ffc94d" />
      </radialGradient>
    </defs>
  );
}

function Leaf({ x, y, rotate, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path
        d="M0,0 C -9,-6 -12,-17 0,-23 C 12,-17 9,-6 0,0 Z"
        fill="url(#pc-leaf)"
        stroke="#2f6b3a"
        strokeWidth="1"
      />
      <path d="M0,-2 L0,-20" stroke="#2f6b3a" strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />
    </g>
  );
}

function Petal({ angle, scale = 1 }) {
  return (
    <g transform={`rotate(${angle}) scale(${scale})`}>
      <path
        d="M0,0 C -8,-5 -10,-15 0,-21 C 10,-15 8,-5 0,0 Z"
        fill="url(#pc-petal)"
        stroke="#e8749a"
        strokeWidth="0.8"
      />
    </g>
  );
}

function Flower({ x, y, scale = 1 }) {
  const angles = [0, 60, 120, 180, 240, 300];
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {angles.map((a) => (
        <Petal key={a} angle={a} />
      ))}
      <circle r="9" fill="url(#pc-center)" stroke="#e0a336" strokeWidth="0.8" />
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

// 화분 몸통에 표정을 그려요 (단계가 올라갈수록 더 활짝 웃어요)
function Face({ stage }) {
  const smile = [
    "M92,192 L108,192", // 0: 새근새근
    "M90,190 Q100,195 110,190", // 1
    "M89,189 Q100,198 111,189", // 2
    "M87,188 Q100,201 113,188", // 3
    "M86,187 Q100,203 114,187", // 4
    "M85,186 Q100,206 115,186", // 5
  ][stage];

  const blush = stage >= 2;

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

function Pot({ stage }) {
  return (
    <g>
      <ellipse cx="100" cy="216" rx="44" ry="7" fill="#2f6b3a" opacity="0.15" />
      <path
        d="M58,156 L142,156 L131,207 C130,211 126,214 122,214 L78,214 C74,214 70,211 69,207 Z"
        fill="url(#pc-pot)"
        stroke="#8a5330"
        strokeWidth="3"
      />
      <rect x="50" y="140" width="100" height="18" rx="9" fill="url(#pc-rim)" stroke="#8a5330" strokeWidth="2.5" />
      <ellipse cx="100" cy="150" rx="42" ry="8" fill="url(#pc-soil)" />
      <ellipse cx="84" cy="149" rx="4" ry="1.6" fill="#2f1d13" opacity="0.5" />
      <ellipse cx="116" cy="151" rx="5" ry="1.8" fill="#2f1d13" opacity="0.5" />
      <Face stage={stage} />
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

const STEM_TOP = { 0: 150, 1: 138, 2: 118, 3: 96, 4: 78, 5: 70 };

function Stem({ stage }) {
  if (stage === 0) return null;
  return (
    <path
      d={`M100,152 C100,${(152 + STEM_TOP[stage]) / 2} 98,${STEM_TOP[stage] + 6} 100,${STEM_TOP[stage]}`}
      fill="none"
      stroke="url(#pc-stem)"
      strokeWidth={stage <= 1 ? 5 : 7}
      strokeLinecap="round"
    />
  );
}

function Plant({ stage }) {
  const leaves = LEAF_SETS[stage] ?? [];

  return (
    <g>
      <Stem stage={stage} />
      {leaves.map((l, i) => (
        <Leaf key={i} {...l} />
      ))}

      {stage === 0 && <circle cx="100" cy="148" r="3" fill="#7a5a3c" />}

      {stage === 4 && (
        <path
          d="M100,60 C91,64 91,77 100,82 C109,77 109,64 100,60 Z"
          fill="url(#pc-petal)"
          stroke="#e8749a"
          strokeWidth="1"
        />
      )}

      {stage === 5 && (
        <>
          <Flower x={100} y={58} />
          <Flower x={72} y={100} scale={0.6} />
          <Sparkle x={132} y={54} scale={0.9} />
          <Sparkle x={60} y={70} scale={0.7} opacity={0.8} />
          <Sparkle x={112} y={30} scale={0.6} opacity={0.7} />
        </>
      )}
    </g>
  );
}

export default function PlantCharacter({ stage = 0, size = 220 }) {
  const clamped = Math.min(5, Math.max(0, stage));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg viewBox="0 0 200 224" width={size} height={size * 1.12}>
        <Defs />
        <Plant stage={clamped} />
        <Pot stage={clamped} />
      </svg>
      <div style={{ fontWeight: 600, color: "#2f6b3a" }}>
        {clamped}단계 · {STAGE_LABELS[clamped]}
      </div>
    </div>
  );
}

export { STAGE_LABELS };
