import FaceDetection from '@react-native-ml-kit/face-detection';
import { FACE_MIN_SIZE, FACE_MAX_ROTATION } from '../constants';

const FaceDetectionService = {

  async detectFace(imagePath) {
    try {
      const faces = await FaceDetection.detect(imagePath, {
        landmarkMode: 'none',
        contourMode: 'none',
        classificationMode: 'none',
        performanceMode: 'fast',
        minFaceSize: 0.3,
      });
      return faces;
    } catch (error) {
      throw new Error(`Face detection failed: ${error.message}`);
    }
  },

  validateFaces(faces) {
    if (!faces || faces.length === 0) {
      return { valid: false, error: 'No face detected. Please position your face in the frame.' };
    }

    if (faces.length > 1) {
      return { valid: false, error: 'Multiple faces detected. Please ensure only one face is visible.' };
    }

    const face = faces[0];

    const faceWidth = face.frame.right - face.frame.left;
    const faceHeight = face.frame.bottom - face.frame.top;
    const faceSize = Math.min(faceWidth, faceHeight);

    if (faceSize < FACE_MIN_SIZE) {
      return { valid: false, error: 'Face too small. Please move closer to the camera.' };
    }

    const headEulerY = Math.abs(face.headEulerY || 0);
    const headEulerZ = Math.abs(face.headEulerZ || 0);

    if (headEulerY > FACE_MAX_ROTATION || headEulerZ > FACE_MAX_ROTATION) {
      return { valid: false, error: 'Please face the camera directly. Head rotation too large.' };
    }

    const smilingProbability = face.smilingProbability || 0;

    return {
      valid: true,
      face,
      faceBounds: {
        left: face.frame.left,
        top: face.frame.top,
        right: face.frame.right,
        bottom: face.frame.bottom,
      },
      headRotation: {
        y: headEulerY,
        z: headEulerZ,
      },
      smilingProbability,
    };
  },

  cropFaceBounds(face, imageWidth, imageHeight) {
    const padding = 0.2;
    const faceWidth = face.frame.right - face.frame.left;
    const faceHeight = face.frame.bottom - face.frame.top;
    const cropSize = Math.max(faceWidth, faceHeight) * (1 + padding);

    const centerX = (face.frame.left + face.frame.right) / 2;
    const centerY = (face.frame.top + face.frame.bottom) / 2;

    let left = Math.max(0, centerX - cropSize / 2);
    let top = Math.max(0, centerY - cropSize / 2);
    let right = Math.min(imageWidth, centerX + cropSize / 2);
    let bottom = Math.min(imageHeight, centerY + cropSize / 2);

    return { left, top, right, bottom };
  },
};

export default FaceDetectionService;
