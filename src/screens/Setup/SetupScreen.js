import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Typography, Spacing } from '../../theme';
import { DEVICE_TYPES, DEFAULT_ADMIN_PIN } from '../../constants';
import useAppStore from '../../store/useAppStore';
import DatabaseService from '../../database/DatabaseService';

function SetupScreen({ navigation }) {
  const [selectedType, setSelectedType] = useState(null);
  const [adminPin, setAdminPin] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [step, setStep] = useState('choose');
  const [pinError, setPinError] = useState('');
  const setSettings = useAppStore((state) => state.setSettings);
  const setFirstLaunch = useAppStore((state) => state.setFirstLaunch);

  const handleContinue = () => {
    if (selectedType === DEVICE_TYPES.ADMIN) {
      setStep('admin_pin');
    } else if (selectedType === DEVICE_TYPES.ENTRANCE) {
      setStep('entrance_setup');
    }
  };

  const handleBack = () => {
    setPinError('');
    setAdminPin('');
    setStep('choose');
  };

  const handlePinChange = (value) => {
    setAdminPin(value);
    if (pinError) {
      setPinError('');
    }
  };

  const handlePinSubmit = () => {
    if (adminPin !== DEFAULT_ADMIN_PIN) {
      setPinError('Incorrect PIN. Please try again.');
      setAdminPin('');
      return;
    }
    const newSettings = {
      deviceType: DEVICE_TYPES.ADMIN,
      deviceName: 'Admin Device',
      adminPin: DEFAULT_ADMIN_PIN,
    };
    DatabaseService.saveSettings(newSettings);
    setSettings(newSettings);
    setFirstLaunch(false);
    navigation.reset({ index: 0, routes: [{ name: 'AdminDashboard' }] });
  };

  const handleEntranceSubmit = () => {
    if (adminPin !== DEFAULT_ADMIN_PIN) {
      setPinError('Incorrect PIN. Please try again.');
      setAdminPin('');
      return;
    }
    const newSettings = {
      deviceType: DEVICE_TYPES.ENTRANCE,
      deviceName: deviceName.trim() || 'Front Door',
      adminPin: DEFAULT_ADMIN_PIN,
    };
    DatabaseService.saveSettings(newSettings);
    setSettings(newSettings);
    setFirstLaunch(false);
    navigation.reset({ index: 0, routes: [{ name: 'EntranceHome' }] });
  };

  if (step === 'choose') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.title}>Choose Device</Text>
        <TouchableOpacity
          style={[
            styles.option,
            selectedType === DEVICE_TYPES.ADMIN && styles.optionSelected,
          ]}
          onPress={() => setSelectedType(DEVICE_TYPES.ADMIN)}
          activeOpacity={0.7}
        >
          <Text style={styles.optionIcon}>⚙️</Text>
          <Text style={styles.optionText}>Admin</Text>
          <Text style={styles.optionDesc}>Manage people and settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.option,
            selectedType === DEVICE_TYPES.ENTRANCE && styles.optionSelected,
          ]}
          onPress={() => setSelectedType(DEVICE_TYPES.ENTRANCE)}
          activeOpacity={0.7}
        >
          <Text style={styles.optionIcon}>🚪</Text>
          <Text style={styles.optionText}>Entrance Device</Text>
          <Text style={styles.optionDesc}>Face recognition at entry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !selectedType && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!selectedType}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      {step === 'admin_pin' && (
        <>
          <Text style={styles.title}>Admin PIN</Text>
          <Text style={styles.subtitle}>Enter the admin PIN to continue</Text>
          <TextInput
            style={[styles.input, pinError ? styles.inputError : null]}
            value={adminPin}
            onChangeText={handlePinChange}
            keyboardType="number-pad"
            secureTextEntry
            placeholder="Enter PIN"
            placeholderTextColor={Colors.textLight}
            maxLength={4}
            autoFocus
          />
          {pinError ? (
            <Text style={styles.errorText}>{pinError}</Text>
          ) : null}
          <TouchableOpacity
            style={[
              styles.button,
              adminPin.length < 4 && styles.buttonDisabled,
            ]}
            onPress={handlePinSubmit}
            disabled={adminPin.length < 4}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 'entrance_setup' && (
        <>
          <Text style={styles.title}>Device Setup</Text>
          <Text style={styles.subtitle}>Admin PIN</Text>
          <TextInput
            style={[styles.input, pinError ? styles.inputError : null]}
            value={adminPin}
            onChangeText={handlePinChange}
            keyboardType="number-pad"
            secureTextEntry
            placeholder="Enter admin PIN"
            placeholderTextColor={Colors.textLight}
            maxLength={4}
            autoFocus
          />
          {pinError ? (
            <Text style={styles.errorText}>{pinError}</Text>
          ) : null}
          <Text style={styles.subtitle}>Device Name</Text>
          <TextInput
            style={styles.input}
            value={deviceName}
            onChangeText={setDeviceName}
            placeholder="e.g. Front Door"
            placeholderTextColor={Colors.textLight}
          />
          <TouchableOpacity
            style={[
              styles.button,
              adminPin.length < 4 && styles.buttonDisabled,
            ]}
            onPress={handleEntranceSubmit}
            disabled={adminPin.length < 4}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    zIndex: 1,
  },
  backText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  option: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#EBF5FF',
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  optionText: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  optionDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
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
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.md,
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
});

export default SetupScreen;
