import { EMBEDDING_SIZE } from '../constants';
import DatabaseService from '../database/DatabaseService';
import MobileFaceNetService from '../ml/MobileFaceNetService';
import { matchAgainstThreshold } from '../recognition/matcher';

const MODEL_PATH = 'mobilefacenet.onnx';

let modelLoadAttempted = false;

const RecognitionService = {
  async ensureModelLoaded() {
    if (modelLoadAttempted) {
      return MobileFaceNetService.isModelLoaded();
    }
    modelLoadAttempted = true;
    try {
      await MobileFaceNetService.loadModel(MODEL_PATH);
      return true;
    } catch {
      return false;
    }
  },

  isModelReady() {
    return MobileFaceNetService.isModelLoaded();
  },

  async generateEmbedding(preprocessedData) {
    if (MobileFaceNetService.isModelLoaded()) {
      return await MobileFaceNetService.generateEmbedding(preprocessedData);
    }

    const embedding = [];
    for (let i = 0; i < EMBEDDING_SIZE; i++) {
      embedding.push(Math.random() * 2 - 1);
    }

    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= norm;
    }

    return embedding;
  },

  recognizePerson(embedding) {
    const persons = DatabaseService.getPersons();
    return matchAgainstThreshold(embedding, persons);
  },
};

export default RecognitionService;
