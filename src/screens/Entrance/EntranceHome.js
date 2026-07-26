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
import useAppStore from '../../store/useAppStore';

function EntranceHome() {
  const [showCamera, setShowCamera] = useState(false);
  const settings = useAppStore((state) => state.settings);
  const { isProcessing, result, recognizeFace, resetResult } = useFaceRecognition();

  const handleEnter = () => {
    resetResult();
    setShowCamera(true);
  };

  const handleFaceCaptured = useCallback(
    async (captureResult) => {
      setShowCamera(false);
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

  if (result) {
    return (
      <View
        style={[
          styles.container,
          result.recognized ? styles.bgSuccess : styles.bgError,
        ]}
      >
        <Text style={styles.resultEmoji}>
          {result.recognized ? '🙂' : '😟'}
        </Text>
        <Text style={styles.resultTitle}>
          {result.recognized ? `Welcome, ${result.person.name}!` : 'Unknown Person'}
        </Text>
        {!result.recognized && (
          <Text style={styles.resultSub}>Access Denied</Text>
        )}
        <TouchableOpacity
          style={[
            styles.resetButton,
            result.recognized ? styles.resetSuccess : styles.resetError,
          ]}
          onPress={resetResult}
          activeOpacity={0.7}
        >
          <Text style={styles.resetText}>OK</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.deviceName}>{settings.deviceName}</Text>
      <TouchableOpacity
        style={styles.enterButton}
        onPress={handleEnter}
        activeOpacity={0.7}
      >
        <Text style={styles.enterText}>ENTER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
  },
  bgSuccess: {
    backgroundColor: Colors.success,
  },
  bgError: {
    backgroundColor: Colors.error,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  deviceName: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  enterButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
  },
  enterText: {
    ...Typography.h3,
    color: Colors.white,
  },
  resultEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  resultTitle: {
    ...Typography.h2,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  resultSub: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.lg,
  },
  resetButton: {
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    marginTop: Spacing.lg,
  },
  resetSuccess: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  resetError: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  resetText: {
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

export default EntranceHome;
