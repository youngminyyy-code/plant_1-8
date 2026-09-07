import sharp from "sharp";

const POT_CENTER_X = 350;
const POT_TOP_Y = 650;
const EYE_Y = POT_TOP_Y + 55;
const EYE_DX = 42;
const MOUTH_Y = POT_TOP_Y + 78;

const mouthTier3 = `M${POT_CENTER_X - 30},${MOUTH_Y - 8} Q${POT_CENTER_X},${MOUTH_Y + 22} ${POT_CENTER_X + 30},${MOUTH_Y - 8}`;

const svgOverlay = `
<svg width="700" height="800" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${POT_CENTER_X - EYE_DX}" cy="${EYE_Y}" r="11" fill="#2b2b2b" />
  <circle cx="${POT_CENTER_X + EYE_DX}" cy="${EYE_Y}" r="11" fill="#2b2b2b" />
  <circle cx="${POT_CENTER_X - EYE_DX - 3.5}" cy="${EYE_Y - 3.5}" r="3.5" fill="#ffffff" />
  <circle cx="${POT_CENTER_X + EYE_DX - 3.5}" cy="${EYE_Y - 3.5}" r="3.5" fill="#ffffff" />
  <ellipse cx="${POT_CENTER_X - 66}" cy="${EYE_Y + 22}" rx="14" ry="9" fill="#ff9fb0" opacity="0.55" />
  <ellipse cx="${POT_CENTER_X + 66}" cy="${EYE_Y + 22}" rx="14" ry="9" fill="#ff9fb0" opacity="0.55" />
  <path d="${mouthTier3}" fill="none" stroke="#2b2b2b" stroke-width="5" stroke-linecap="round" />
</svg>
`;

for (const name of ["basil-0", "basil-5", "tomato-0", "tomato-5"]) {
  const base = sharp(`./public/characters/${name}.png`);
  await base
    .composite([{ input: Buffer.from(svgOverlay) }])
    .png()
    .toFile(`./scripts/preview-${name}.png`);
}
console.log("완료");
