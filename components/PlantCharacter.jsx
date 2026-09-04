const STAGE_LABELS = [
  "새싹 준비 중",
  "새싹이 났어요",
  "쑥쑥 자라는 중",
  "잎이 무성해요",
  "꽃봉오리가 맺혔어요",
  "활짝 피었어요!",
];

function Pot() {
  return (
    <g>
      <path
        d="M60 160 L140 160 L130 210 L70 210 Z"
        fill="#c97b4a"
        stroke="#8a5330"
        strokeWidth="3"
      />
      <rect
        x="53"
        y="148"
        width="94"
        height="16"
        rx="5"
        fill="#e0975f"
        stroke="#8a5330"
        strokeWidth="3"
      />
      <ellipse cx="100" cy="156" rx="38" ry="7" fill="#5a3d2b" />
    </g>
  );
}

function Stage0() {
  // 아무것도 심지 않은 화분
  return null;
}

function Stage1() {
  // 막 튼 새싹
  return (
    <g>
      <line x1="100" y1="153" x2="100" y2="138" stroke="#4c9a5c" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="90" cy="136" rx="11" ry="6" fill="#6cb56f" transform="rotate(-25 90 136)" />
      <ellipse cx="110" cy="136" rx="11" ry="6" fill="#6cb56f" transform="rotate(25 110 136)" />
    </g>
  );
}

function Stage2() {
  // 자라는 새싹
  return (
    <g>
      <path d="M100 153 C100 130, 100 120, 100 108" fill="none" stroke="#4c9a5c" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="86" cy="130" rx="14" ry="7" fill="#5fa968" transform="rotate(-30 86 130)" />
      <ellipse cx="114" cy="130" rx="14" ry="7" fill="#5fa968" transform="rotate(30 114 130)" />
      <ellipse cx="90" cy="110" rx="12" ry="6" fill="#6cb56f" transform="rotate(-20 90 110)" />
      <ellipse cx="110" cy="110" rx="12" ry="6" fill="#6cb56f" transform="rotate(20 110 110)" />
    </g>
  );
}

function Stage3() {
  // 잎이 무성한 식물
  return (
    <g>
      <path d="M100 153 C100 120, 98 100, 100 82" fill="none" stroke="#3f8a4d" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="80" cy="125" rx="17" ry="8" fill="#5fa968" transform="rotate(-30 80 125)" />
      <ellipse cx="120" cy="125" rx="17" ry="8" fill="#5fa968" transform="rotate(30 120 125)" />
      <ellipse cx="82" cy="100" rx="15" ry="7" fill="#6cb56f" transform="rotate(-25 82 100)" />
      <ellipse cx="118" cy="100" rx="15" ry="7" fill="#6cb56f" transform="rotate(25 118 100)" />
      <ellipse cx="92" cy="82" rx="13" ry="6" fill="#7cc57e" transform="rotate(-15 92 82)" />
      <ellipse cx="108" cy="82" rx="13" ry="6" fill="#7cc57e" transform="rotate(15 108 82)" />
    </g>
  );
}

function Stage4() {
  // 꽃봉오리
  return (
    <g>
      <path d="M100 153 C100 118, 98 95, 100 72" fill="none" stroke="#3f8a4d" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="78" cy="122" rx="18" ry="8" fill="#5fa968" transform="rotate(-30 78 122)" />
      <ellipse cx="122" cy="122" rx="18" ry="8" fill="#5fa968" transform="rotate(30 122 122)" />
      <ellipse cx="80" cy="96" rx="16" ry="7" fill="#6cb56f" transform="rotate(-25 80 96)" />
      <ellipse cx="120" cy="96" rx="16" ry="7" fill="#6cb56f" transform="rotate(25 120 96)" />
      <ellipse cx="90" cy="76" rx="13" ry="6" fill="#7cc57e" transform="rotate(-15 90 76)" />
      <ellipse cx="110" cy="76" rx="13" ry="6" fill="#7cc57e" transform="rotate(15 110 76)" />
      <ellipse cx="100" cy="62" rx="11" ry="14" fill="#e88fa6" />
    </g>
  );
}

function Stage5() {
  // 활짝 핀 꽃
  const petals = [0, 60, 120, 180, 240, 300];
  return (
    <g>
      <path d="M100 153 C100 116, 98 92, 100 68" fill="none" stroke="#3f8a4d" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="76" cy="120" rx="19" ry="9" fill="#5fa968" transform="rotate(-30 76 120)" />
      <ellipse cx="124" cy="120" rx="19" ry="9" fill="#5fa968" transform="rotate(30 124 120)" />
      <ellipse cx="78" cy="94" rx="16" ry="7" fill="#6cb56f" transform="rotate(-25 78 94)" />
      <ellipse cx="122" cy="94" rx="16" ry="7" fill="#6cb56f" transform="rotate(25 122 94)" />
      <g transform="translate(100 55)">
        {petals.map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-13"
            rx="9"
            ry="14"
            fill="#f4a6bd"
            transform={`rotate(${angle})`}
          />
        ))}
        <circle cx="0" cy="0" r="9" fill="#ffcf5c" />
      </g>
      <g transform="translate(70 100)">
        {petals.map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-8"
            rx="6"
            ry="9"
            fill="#f4a6bd"
            opacity="0.9"
            transform={`rotate(${angle})`}
          />
        ))}
        <circle cx="0" cy="0" r="5" fill="#ffcf5c" />
      </g>
    </g>
  );
}

const STAGES = [Stage0, Stage1, Stage2, Stage3, Stage4, Stage5];

export default function PlantCharacter({ stage = 0, size = 220 }) {
  const clamped = Math.min(5, Math.max(0, stage));
  const StagePlant = STAGES[clamped];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg viewBox="0 0 200 220" width={size} height={size * 1.1}>
        <StagePlant />
        <Pot />
      </svg>
      <div style={{ fontWeight: 600, color: "#2f6b3a" }}>
        {clamped}단계 · {STAGE_LABELS[clamped]}
      </div>
    </div>
  );
}

export { STAGE_LABELS };
