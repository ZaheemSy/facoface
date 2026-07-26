import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, Spacing } from '../../theme';
import FaceCaptureView from '../../components/FaceCaptureView';
import useFaceRecognition from '../../hooks/useFaceRecognition';

function RegisterPerson({ route, navigation }) {
  const existingPersonId = route?.params?.personId ?? null;
  const existingPersonName = route?.params?.personName ?? '';

  const [name, setName] = useState(existingPersonName);
  const [showCamera, setShowCamera] = useState(false);

  const { isProcessing, registerFace, reRegisterFace } = useFaceRecognition();

  const handleStartCapture = () => {
    if (!name.trim() && !existingPersonId) {
      return;
    }
    setShowCamera(true);
  };

  const handleFaceCaptured = useCallback(
    async (result) => {
      try {
        if (existingPersonId) {
          await reRegisterFace(
            existingPersonId,
            result.imagePath,
            result.cropBounds,
          );
          Alert.alert('Success', 'Face re-registered successfully.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        } else {
          await registerFace(name, result.imagePath, result.cropBounds);
          Alert.alert('Success', `${name.trim()} registered successfully.`, [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      } catch (error) {
        Alert.alert('Error', `Failed to process face: ${error.message}`);
      }
    },
    [name, existingPersonId, navigation, registerFace, reRegisterFace],
  );

  const handleCloseCamera = useCallback(() => {
    setShowCamera(false);
  }, []);

  if (isProcessing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.processingText}>Processing face...</Text>
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
      <Text style={styles.title}>
        {existingPersonId ? 'Re-register Face' : 'Register Person'}
      </Text>
      <Text style={styles.subtitle}>
        {existingPersonId
          ? `Updating face for "${existingPersonName}"`
          : 'Enter the name of the person to register'}
      </Text>
      {!existingPersonId && (
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Full name"
          placeholderTextColor={Colors.textLight}
          autoFocus
        />
      )}
      <TouchableOpacity
        style={[
          styles.button,
          (!name.trim() && !existingPersonId) && styles.buttonDisabled,
        ]}
        onPress={handleStartCapture}
        disabled={!name.trim() && !existingPersonId}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>
          {existingPersonId
            ? 'Start Face Capture'
            : 'Continue to Face Capture'}
        </Text>
      </TouchableOpacity>
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
  title: {
    ...Typography.h2,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: 18,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
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

export default RegisterPerson;
