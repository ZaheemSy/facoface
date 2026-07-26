import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors, Typography, Spacing } from '../../theme';
import useAppStore from '../../store/useAppStore';
import DatabaseService from '../../database/DatabaseService';
import { DEFAULT_ADMIN_PIN } from '../../constants';

function Settings({ navigation }) {
  const settings = useAppStore((state) => state.settings);
  const setSettings = useAppStore((state) => state.setSettings);
  const setFirstLaunch = useAppStore((state) => state.setFirstLaunch);

  const [deviceName, setDeviceName] = useState(settings.deviceName);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [showPinChange, setShowPinChange] = useState(false);

  const handleSaveName = () => {
    const updated = { ...settings, deviceName: deviceName.trim() || settings.deviceName };
    DatabaseService.saveSettings(updated);
    setSettings(updated);
    Alert.alert('Saved', 'Device name updated.');
  };

  const handleChangePin = () => {
    if (currentPin !== DEFAULT_ADMIN_PIN) {
      Alert.alert('Error', 'Current PIN is incorrect');
      return;
    }
    if (newPin.length !== 4) {
      Alert.alert('Error', 'New PIN must be 4 digits');
      return;
    }
    const updated = { ...settings, adminPin: newPin };
    DatabaseService.saveSettings(updated);
    setSettings(updated);
    setCurrentPin('');
    setNewPin('');
    setShowPinChange(false);
    Alert.alert('Success', 'Admin PIN changed.');
  };

  const handleResetDevice = () => {
    Alert.alert(
      'Reset Device',
      'This will clear all settings and return to setup. All data will be preserved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const reset = {
              deviceType: '',
              deviceName: '',
              adminPin: DEFAULT_ADMIN_PIN,
            };
            DatabaseService.saveSettings(reset);
            setSettings(reset);
            setFirstLaunch(true);
            navigation.reset({ index: 0, routes: [{ name: 'Setup' }] });
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device</Text>
        <Text style={styles.fieldLabel}>Device Type</Text>
        <Text style={styles.fieldValue}>
          {settings.deviceType === 'admin' ? 'Admin' : 'Entrance Device'}
        </Text>
        <Text style={styles.fieldLabel}>Device Name</Text>
        <TextInput
          style={styles.input}
          value={deviceName}
          onChangeText={setDeviceName}
          placeholder="Device name"
          placeholderTextColor={Colors.textLight}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveName}>
          <Text style={styles.saveText}>Save Name</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        {showPinChange ? (
          <>
            <Text style={styles.fieldLabel}>Current PIN</Text>
            <TextInput
              style={styles.input}
              value={currentPin}
              onChangeText={setCurrentPin}
              keyboardType="number-pad"
              secureTextEntry
              placeholder="Enter current PIN"
              placeholderTextColor={Colors.textLight}
              maxLength={4}
            />
            <Text style={styles.fieldLabel}>New PIN</Text>
            <TextInput
              style={styles.input}
              value={newPin}
              onChangeText={setNewPin}
              keyboardType="number-pad"
              secureTextEntry
              placeholder="Enter new 4-digit PIN"
              placeholderTextColor={Colors.textLight}
              maxLength={4}
            />
            <View style={styles.pinActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowPinChange(false);
                  setCurrentPin('');
                  setNewPin('');
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (currentPin.length < 4 || newPin.length < 4) && styles.buttonDisabled,
                ]}
                onPress={handleChangePin}
                disabled={currentPin.length < 4 || newPin.length < 4}
              >
                <Text style={styles.saveText}>Change PIN</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowPinChange(true)}
          >
            <Text style={styles.actionText}>Change Admin PIN</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Reset</Text>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetDevice}
        >
          <Text style={styles.resetText}>Reconfigure Device</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  fieldValue: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: Spacing.sm,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  saveText: {
    ...Typography.button,
    color: Colors.white,
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  actionButton: {
    paddingVertical: Spacing.sm,
  },
  actionText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  pinActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  cancelText: {
    ...Typography.button,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  resetButton: {
    backgroundColor: Colors.errorLight,
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  resetText: {
    ...Typography.button,
    color: Colors.error,
    fontSize: 14,
  },
});

export default Settings;
