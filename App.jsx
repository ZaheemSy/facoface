import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import DatabaseService from './src/database/DatabaseService';
import RecognitionService from './src/services/RecognitionService';
import useAppStore from './src/store/useAppStore';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const setSettings = useAppStore((state) => state.setSettings);
  const setFirstLaunch = useAppStore((state) => state.setFirstLaunch);

  useEffect(() => {
    DatabaseService.initialize();
    const settings = DatabaseService.getSettings();
    if (settings) {
      setSettings({
        deviceType: settings.deviceType || '',
        deviceName: settings.deviceName || '',
        adminPin: settings.adminPin || '1234',
      });
      setFirstLaunch(!settings.deviceType);
    }
    RecognitionService.ensureModelLoaded();
  }, [setSettings, setFirstLaunch]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
