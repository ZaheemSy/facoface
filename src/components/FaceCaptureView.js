import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { Colors, Typography, Spacing } from '../theme';
import FaceDetectionService from '../services/FaceDetectionService';

function FaceCaptureView({ onFaceCaptured, onClose }) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');
  const camera = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Position your face in the frame');

  const handleCapture = useCallback(async () => {
    if (!camera.current || isCapturing) {
      return;
    }

    try {
      setIsCapturing(true);
      setStatusMessage('Capturing...');

      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'speed',
        skipMetadata: true,
      });

      const faces = await FaceDetectionService.detectFace(photo.path);
      const validation = FaceDetectionService.validateFaces(faces);

      if (!validation.valid) {
        setStatusMessage(validation.error);
        setIsCapturing(false);
        return;
      }

      setStatusMessage('Face detected! Processing...');

      const imageWidth = photo.width || 1080;
      const imageHeight = photo.height || 1920;

      const faceCropBounds = FaceDetectionService.cropFaceBounds(
        validation.face,
        imageWidth,
        imageHeight,
      );

      onFaceCaptured({
        imagePath: photo.path,
        faceBounds: validation.faceBounds,
        cropBounds: faceCropBounds,
        face: validation.face,
        imageWidth,
        imageHeight,
      });
    } catch {
      setStatusMessage('Error capturing face. Please try again.');
      setIsCapturing(false);
    }
  }, [isCapturing, onFaceCaptured]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Camera permission is required</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No front camera available</Text>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      <View style={styles.overlay}>
        <View style={styles.faceGuide} />
        <Text style={styles.statusText}>{statusMessage}</Text>
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
          onPress={handleCapture}
          disabled={isCapturing}
        >
          <View style={styles.captureInner} />
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderStyle: 'dashed',
  },
  statusText: {
    ...Typography.body,
    color: Colors.white,
    textAlign: 'center',
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
  },
  closeButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  closeText: {
    ...Typography.body,
    color: Colors.white,
  },
  placeholder: {
    width: 60,
  },
  message: {
    ...Typography.body,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  buttonText: {
    ...Typography.button,
    color: Colors.white,
  },
});

export default FaceCaptureView;
