import sharp from "sharp";

const CANVAS_H = 800;
const POT_BAND = 150; // 캔버스 하단부터 이 높이만큼을 "화분 영역"으로 보고 중심 계산

const files = [];
for (const species of ["basil", "tomato"]) {
  for (let i = 0; i <= 5; i++) files.push(`${species}-${i}`);
}

for (const name of files) {
  const filePath = `./public/characters/${name}.png`;
  const { data, info } = await sharp(filePath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const bandTop = Math.max(0, height - POT_BAND);
  let sumX = 0;
  let count = 0;
  let minY = Infinity;

  for (let y = bandTop; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * channels + 3];
      if (alpha > 100) {
        sumX += x;
        count++;
        if (y < minY) minY = y;
      }
    }
  }

  const centerX = count ? Math.round(sumX / count) : width / 2;
  console.log(`${name}: centerX=${centerX}, potTopY=${minY === Infinity ? "?" : minY}, canvasW=${width}, canvasH=${height}`);
}
