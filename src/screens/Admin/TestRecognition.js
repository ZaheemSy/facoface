import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, Spacing } from '../../theme';
import FaceCaptureView from '../../components/FaceCaptureView';
import useFaceRecognition from '../../hooks/useFaceRecognition';

function TestRecognition() {
  const [showCamera, setShowCamera] = useState(false);
  const [result, setResult] = useState(null);

  const handleRecognitionResult = useCallback((recognitionResult) => {
    setResult(recognitionResult);
  }, []);

  const { isProcessing, recognizeFace } = useFaceRecognition({
    onResult: handleRecognitionResult,
  });

  const handleStart = () => {
    setResult(null);
    setShowCamera(true);
  };

  const handleFaceCaptured = useCallback(
    async (captureResult) => {
      await recognizeFace(captureResult.imagePath, captureResult.cropBounds);
    },
    [recognizeFace],
  );

  const handleCloseCamera = useCallback(() => {
    setShowCamera(false);
  }, []);

  if (isProcessing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.processingText}>Recognizing...</Text>
      </View>
    );
  }

  if (showCamera) {
    return (
      <FaceCaptureView
        onFaceCaptured={handleFaceCaptured}
        onClose={handleCloseCamera}
      />
    );
  }

  return (
    <View style={styles.container}>
      {result ? (
        <View
          style={[
            styles.resultCard,
            result.recognized ? styles.resultSuccess : styles.resultFail,
          ]}
        >
          <Text style={styles.resultIcon}>
            {result.recognized ? '✅' : '❌'}
          </Text>
          <Text style={styles.resultTitle}>
            {result.recognized ? 'Recognized' : 'Unknown Person'}
          </Text>
          {result.recognized && (
            <Text style={styles.resultName}>{result.person.name}</Text>
          )}
          <Text style={styles.resultConfidence}>
            Confidence: {(result.confidence * 100).toFixed(1)}%
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleStart}
            activeOpacity={0.7}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.center}>
          <Text style={styles.instruction}>
            Press the button below to test face recognition
          </Text>
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleStart}
            activeOpacity={0.7}
          >
            <Text style={styles.testButtonText}>Start Recognition Test</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  center: {
    alignItems: 'center',
  },
  instruction: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  testButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  testButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
  resultCard: {
    borderRadius: 20,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  resultSuccess: {
    backgroundColor: Colors.successLight,
    borderWidth: 2,
    borderColor: Colors.success,
  },
  resultFail: {
    backgroundColor: Colors.errorLight,
    borderWidth: 2,
    borderColor: Colors.error,
  },
  resultIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  resultTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  resultName: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  resultConfidence: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  retryText: {
    ...Typography.button,
    color: Colors.white,
  },
  processingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});

export default TestRecognition;
