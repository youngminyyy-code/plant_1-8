// 사진 업로드 전에 처리하는 유틸리티
// 1) 너무 큰 파일(동영상 등 실수로 선택한 경우)은 거절
// 2) 아이폰 HEIC/HEIF 사진은 JPEG로 자동 변환 (다른 기기에서 안 보이는 문제 방지)
// 3) 가로/세로가 너무 큰 사진은 적당한 크기로 줄이고 압축 (용량 절약)

const HARD_MAX_BYTES = 20 * 1024 * 1024; // 20MB - 이보다 크면 아예 거절
const MAX_DIMENSION = 1600; // 긴 변 기준 최대 픽셀
const JPEG_QUALITY = 0.82;

function isHeic(file) {
  const type = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();
  return (
    type.includes("heic") ||
    type.includes("heif") ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

async function toJpegIfHeic(file) {
  if (!isHeic(file)) return file;

  const heic2any = (await import("heic2any")).default;
  const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: JPEG_QUALITY });
  const blob = Array.isArray(converted) ? converted[0] : converted;
  return new File([blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
    type: "image/jpeg",
  });
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

async function resizeAndCompress(file) {
  const img = await loadImage(file);
  const { width, height } = img;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));

  // 이미 충분히 작으면 굳이 다시 인코딩하지 않아요
  if (scale === 1 && file.type === "image/jpeg" && file.size < 1.5 * 1024 * 1024) {
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
  );

  if (!blob) return file; // 혹시 실패하면 원본이라도 올리기

  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
    type: "image/jpeg",
  });
}

// 반환값: { file } 성공 시, { error } 실패 시
export async function prepareImageFile(file) {
  if (!file) return { file: null };

  if (file.size > HARD_MAX_BYTES) {
    return { error: "사진 용량이 너무 커요 (20MB 이하로 올려주세요)." };
  }

  if (!file.type.startsWith("image/") && !isHeic(file)) {
    return { error: "이미지 파일만 올릴 수 있어요." };
  }

  try {
    const jpegFile = await toJpegIfHeic(file);
    const finalFile = await resizeAndCompress(jpegFile);
    return { file: finalFile };
  } catch (err) {
    console.error("이미지 처리 실패:", err);
    return { error: "사진을 처리하는 중 문제가 생겼어요. 다른 사진으로 시도해주세요." };
  }
}
