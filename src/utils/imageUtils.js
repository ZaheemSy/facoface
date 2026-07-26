const INPUT_SIZE = 112;

const MEAN = [127.5, 127.5, 127.5];
const STD = [127.5, 127.5, 127.5];

function normalizePixel(value, mean, std) {
  return (value - mean) / std;
}

function preprocessFace(faceImageData, width, height) {
  const inputData = new Float32Array(3 * INPUT_SIZE * INPUT_SIZE);

  // Bilinear interpolation resizing to 112x112
  const scaleX = width / INPUT_SIZE;
  const scaleY = height / INPUT_SIZE;

  for (let y = 0; y < INPUT_SIZE; y++) {
    for (let x = 0; x < INPUT_SIZE; x++) {
      const srcX = x * scaleX;
      const srcY = y * scaleY;

      const x1 = Math.floor(srcX);
      const y1 = Math.floor(srcY);
      const x2 = Math.min(x1 + 1, width - 1);
      const y2 = Math.min(y1 + 1, height - 1);

      const dx = srcX - x1;
      const dy = srcY - y1;

      const idx1 = (y1 * width + x1) * 4;
      const idx2 = (y1 * width + x2) * 4;
      const idx3 = (y2 * width + x1) * 4;
      const idx4 = (y2 * width + x2) * 4;

      const targetIdx = (y * INPUT_SIZE + x) * 3;

      for (let c = 0; c < 3; c++) {
        const p1 = faceImageData[idx1 + c] || 0;
        const p2 = faceImageData[idx2 + c] || 0;
        const p3 = faceImageData[idx3 + c] || 0;
        const p4 = faceImageData[idx4 + c] || 0;

        const interpolated =
          (1 - dx) * (1 - dy) * p1 +
          dx * (1 - dy) * p2 +
          (1 - dx) * dy * p3 +
          dx * dy * p4;

        inputData[targetIdx + c] = interpolated;
      }
    }
  }

  // Normalize to NCHW format
  const normalized = new Float32Array(3 * INPUT_SIZE * INPUT_SIZE);

  for (let h = 0; h < INPUT_SIZE; h++) {
    for (let w = 0; w < INPUT_SIZE; w++) {
      for (let c = 0; c < 3; c++) {
        const srcIdx = (h * INPUT_SIZE + w) * 3 + c;
        const dstIdx = c * INPUT_SIZE * INPUT_SIZE + h * INPUT_SIZE + w;
        normalized[dstIdx] = normalizePixel(
          inputData[srcIdx],
          MEAN[c],
          STD[c],
        );
      }
    }
  }

  return normalized;
}

export { preprocessFace };
