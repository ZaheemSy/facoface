import * as ort from 'onnxruntime-react-native';
import { EMBEDDING_SIZE } from '../constants';

const INPUT_SIZE = 112;
const INPUT_NAME = 'input';
const OUTPUT_NAME = 'output';

let session = null;

const MobileFaceNetService = {

  async loadModel(modelPath) {
    try {
      session = await ort.InferenceSession.create(modelPath, {
        executionProviders: ['cpu'],
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to load MobileFaceNet model: ${error.message}`);
    }
  },

  isModelLoaded() {
    return session !== null;
  },

  async generateEmbedding(preprocessedData) {
    if (!session) {
      throw new Error('Model not loaded. Call loadModel() first.');
    }

    try {
      const tensor = new ort.Tensor(
        'float32',
        preprocessedData,
        [1, 3, INPUT_SIZE, INPUT_SIZE],
      );

      const feeds = {};
      feeds[INPUT_NAME] = tensor;

      const results = await session.run(feeds);

      const outputTensor = results[OUTPUT_NAME];

      if (!outputTensor || !outputTensor.data) {
        throw new Error('Model did not return valid output');
      }

      const embedding = [];
      const data = outputTensor.data;

      for (let i = 0; i < EMBEDDING_SIZE && i < data.length; i++) {
        embedding.push(data[i]);
      }

      const norm = Math.sqrt(
        embedding.reduce((sum, val) => sum + val * val, 0),
      );

      if (norm > 0) {
        for (let i = 0; i < embedding.length; i++) {
          embedding[i] /= norm;
        }
      }

      return embedding;

    } catch (error) {
      throw new Error(`Embedding generation failed: ${error.message}`);
    }
  },

  async release() {
    if (session) {
      await session.release();
      session = null;
    }
  },
};

export default MobileFaceNetService;
