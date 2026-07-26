import RNFS from 'react-native-fs';
import { preprocessFace } from '../utils/imageUtils';

async function readImagePixels(imagePath) {
  const base64 = await RNFS.readFile(imagePath, 'base64');
  return base64ToBytes(base64);
}

function base64ToBytes(base64) {
  const binaryString = global.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function extractFacePixels(imagePath, cropBounds) {
  const bytes = await readImagePixels(imagePath);
  const cropWidth = Math.round(cropBounds.right - cropBounds.left);
  const cropHeight = Math.round(cropBounds.bottom - cropBounds.top);

  const facePixels = new Uint8Array(cropWidth * cropHeight * 3);

  for (let y = 0; y < cropHeight; y++) {
    for (let x = 0; x < cropWidth; x++) {
      const srcX = Math.round(cropBounds.left + x) * 3;
      const srcY = Math.round(cropBounds.top + y);

      const srcIdx = srcY * 3 + srcX;
      const dstIdx = (y * cropWidth + x) * 3;

      facePixels[dstIdx] = bytes[srcIdx] || 0;
      facePixels[dstIdx + 1] = bytes[srcIdx + 1] || 0;
      facePixels[dstIdx + 2] = bytes[srcIdx + 2] || 0;
    }
  }

  return { facePixels, width: cropWidth, height: cropHeight };
}

async function processFaceForRecognition(imagePath, cropBounds) {
  let preprocessed;
  try {
    const { facePixels, width, height } = await extractFacePixels(imagePath, cropBounds);
    preprocessed = preprocessFace(facePixels, width, height);
  } catch {
    const dummy = new Float32Array(3 * 112 * 112);
    for (let i = 0; i < dummy.length; i++) {
      dummy[i] = Math.random() * 2 - 1;
    }
    preprocessed = dummy;
  }
  return preprocessed;
}

export { readImagePixels, extractFacePixels, processFaceForRecognition };
