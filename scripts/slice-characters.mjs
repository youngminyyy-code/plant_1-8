import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC = "./scripts/character-sheet-source.png";
const OUT_DIR = "./public/characters";
const COLS = 6;
const ROWS = 2;
const CANVAS_W = 700;
const CANVAS_H = 800;
const BOTTOM_MARGIN = 20;

const ROW_NAMES = ["basil", "tomato"];

fs.mkdirSync(OUT_DIR, { recursive: true });

const img = sharp(SRC);
const meta = await img.metadata();
const { width, height } = meta;
const { data } = await img.clone().raw().toBuffer({ resolveWithObject: true });

// 1) 체크무늬(회색 두 톤 근처) + 압축 잡음까지 넉넉하게 배경으로 판정
let fg = new Uint8Array(width * height); // 1 = 전경(그림) 후보

for (let i = 0; i < width * height; i++) {
  const r = data[i * 3];
  const g = data[i * 3 + 1];
  const b = data[i * 3 + 2];
  const maxDiff = Math.max(r, g, b) - Math.min(r, g, b);
  const isNeutral = maxDiff <= 18;
  const nearDark = Math.abs(r - 164) <= 35;
  const nearLight = Math.abs(r - 211) <= 35;
  const isChecker = isNeutral && (nearDark || nearLight);
  fg[i] = isChecker ? 0 : 1;
}

// 2) 작은 잡티 제거: 침식(erode) 후 팽창(dilate) - 3x3 모폴로지 오프닝
function erode(mask) {
  const out = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let all = 1;
      for (let dy = -1; dy <= 1 && all; dy++) {
        for (let dx = -1; dx <= 1 && all; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height || !mask[ny * width + nx]) {
            all = 0;
          }
        }
      }
      out[y * width + x] = all;
    }
  }
  return out;
}

function dilate(mask) {
  const out = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let any = 0;
      for (let dy = -1; dy <= 1 && !any; dy++) {
        for (let dx = -1; dx <= 1 && !any; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < width && ny < height && mask[ny * width + nx]) {
            any = 1;
          }
        }
      }
      out[y * width + x] = any;
    }
  }
  return out;
}

let cleaned = erode(fg);
cleaned = erode(cleaned);
cleaned = dilate(cleaned);
cleaned = dilate(cleaned);

const rgba = Buffer.alloc(width * height * 4);
for (let i = 0; i < width * height; i++) {
  const alpha = cleaned[i] ? 255 : 0;
  const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
  rgba[i * 4] = alpha ? r : 0;
  rgba[i * 4 + 1] = alpha ? g : 0;
  rgba[i * 4 + 2] = alpha ? b : 0;
  rgba[i * 4 + 3] = alpha;
}

// 디버그용 확인 이미지
const debugRgba = Buffer.alloc(width * height * 4);
for (let i = 0; i < width * height; i++) {
  const alpha = cleaned[i];
  debugRgba[i * 4] = alpha ? data[i * 3] : 255;
  debugRgba[i * 4 + 1] = alpha ? data[i * 3 + 1] : 0;
  debugRgba[i * 4 + 2] = alpha ? data[i * 3 + 2] : 0;
  debugRgba[i * 4 + 3] = 255;
}
await sharp(debugRgba, { raw: { width, height, channels: 4 } }).png().toFile("./scripts/_debug-mask.png");

console.log("배경 정리 완료, 칸별 자르기 시작");

const cellW = width / COLS;
const cellH = height / ROWS;

for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const cellLeft = Math.round(col * cellW);
    const cellTop = Math.round(row * cellH);
    const cellRight = Math.round((col + 1) * cellW);
    const cellBottom = Math.round((row + 1) * cellH);

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    for (let y = cellTop; y < cellBottom; y++) {
      for (let x = cellLeft; x < cellRight; x++) {
        if (cleaned[y * width + x]) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (minX === Infinity) {
      console.log(`${ROW_NAMES[row]}-${col}: 내용 없음, 건너뜀`);
      continue;
    }

    const boxW = maxX - minX + 1;
    const boxH = maxY - minY + 1;

    const cropped = await sharp(rgba, { raw: { width, height, channels: 4 } })
      .extract({ left: minX, top: minY, width: boxW, height: boxH })
      .png()
      .toBuffer();

    const maxW = CANVAS_W - 40;
    const maxH = CANVAS_H - BOTTOM_MARGIN - 20;
    const scale = Math.min(1, maxW / boxW, maxH / boxH);
    const finalW = Math.max(1, Math.round(boxW * scale));
    const finalH = Math.max(1, Math.round(boxH * scale));

    const resizedBuffer = await sharp(cropped).resize(finalW, finalH).png().toBuffer();

    const left2 = Math.round((CANVAS_W - finalW) / 2);
    const top2 = CANVAS_H - BOTTOM_MARGIN - finalH;

    const finalImage = await sharp({
      create: { width: CANVAS_W, height: CANVAS_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([{ input: resizedBuffer, left: left2, top: top2 }])
      .png()
      .toBuffer();

    const fileName = `${ROW_NAMES[row]}-${col}.png`;
    fs.writeFileSync(path.join(OUT_DIR, fileName), finalImage);
    console.log(`저장: ${fileName} (박스 ${boxW}x${boxH} -> ${finalW}x${finalH})`);
  }
}

console.log("완료!");
