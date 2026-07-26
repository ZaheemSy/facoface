import { useState, useCallback, useRef } from 'react';
import { processFaceForRecognition } from '../camera/imageProcessor';
import RecognitionService from '../services/RecognitionService';
import DatabaseService from '../database/DatabaseService';

function useFaceRecognition({ onResult } = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const processingRef = useRef(false);

  const recognizeFace = useCallback(
    async (imagePath, cropBounds) => {
      if (processingRef.current) {
        return;
      }

      try {
        processingRef.current = true;
        setIsProcessing(true);
        setRecognitionResult(null);

        const preprocessed = await processFaceForRecognition(imagePath, cropBounds);
        const embedding = await RecognitionService.generateEmbedding(preprocessed);
        const recognition = RecognitionService.recognizePerson(embedding);

        DatabaseService.saveLog(
          recognition.person?.id || null,
          recognition.person?.name || 'Unknown',
          recognition.confidence,
          recognition.recognized,
        );

        setRecognitionResult(recognition);
        if (onResult) {
          onResult(recognition);
        }

        return recognition;
      } catch {
        const errorResult = {
          recognized: false,
          person: null,
          confidence: 0,
          error: 'Recognition failed',
        };
        setRecognitionResult(errorResult);
        if (onResult) {
          onResult(errorResult);
        }
        return errorResult;
      } finally {
        setIsProcessing(false);
        processingRef.current = false;
      }
    },
    [onResult],
  );

  const registerFace = useCallback(
    async (name, imagePath, cropBounds) => {
      if (processingRef.current) {
        return null;
      }

      try {
        processingRef.current = true;
        setIsProcessing(true);

        const preprocessed = await processFaceForRecognition(imagePath, cropBounds);
        const embedding = await RecognitionService.generateEmbedding(preprocessed);
        const result = DatabaseService.savePerson(name.trim(), embedding);
        return result;
      } catch (error) {
        throw new Error(`Registration failed: ${error.message}`);
      } finally {
        setIsProcessing(false);
        processingRef.current = false;
      }
    },
    [],
  );

  const reRegisterFace = useCallback(
    async (personId, imagePath, cropBounds) => {
      if (processingRef.current) {
        return;
      }

      try {
        processingRef.current = true;
        setIsProcessing(true);

        const preprocessed = await processFaceForRecognition(imagePath, cropBounds);
        const embedding = await RecognitionService.generateEmbedding(preprocessed);
        DatabaseService.updatePersonEmbedding(personId, embedding);
      } catch (error) {
        throw new Error(`Re-registration failed: ${error.message}`);
      } finally {
        setIsProcessing(false);
        processingRef.current = false;
      }
    },
    [],
  );

  const resetResult = useCallback(() => {
    setRecognitionResult(null);
  }, []);

  return {
    isProcessing,
    result: recognitionResult,
    recognizeFace,
    registerFace,
    reRegisterFace,
    resetResult,
  };
}

export default useFaceRecognition;
