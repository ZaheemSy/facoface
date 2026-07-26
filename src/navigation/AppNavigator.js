import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAppStore from '../store/useAppStore';
import { SCREEN_NAMES, DEVICE_TYPES } from '../constants';
import { Colors, Typography } from '../theme';
import SetupScreen from '../screens/Setup/SetupScreen';
import AdminDashboard from '../screens/Admin/AdminDashboard';
import RegisterPerson from '../screens/Admin/RegisterPerson';
import PersonList from '../screens/Admin/PersonList';
import TestRecognition from '../screens/Admin/TestRecognition';
import Logs from '../screens/Admin/Logs';
import Settings from '../screens/Admin/Settings';
import EntranceHome from '../screens/Entrance/EntranceHome';

const Stack = createNativeStackNavigator();

const defaultScreenOptions = {
  headerShown: false,
};

const adminScreenOptions = {
  headerShown: true,
  headerBackTitle: 'Back',
  headerTintColor: Colors.primary,
  headerTitleStyle: {
    ...Typography.h4,
    color: Colors.text,
  },
  headerStyle: {
    backgroundColor: Colors.background,
  },
  headerShadowVisible: false,
};

function AppNavigator() {
  const settings = useAppStore((state) => state.settings);
  const isFirstLaunch = useAppStore((state) => state.isFirstLaunch);

  const getInitialRoute = () => {
    if (isFirstLaunch || !settings.deviceType) {
      return SCREEN_NAMES.SETUP;
    }
    if (settings.deviceType === DEVICE_TYPES.ADMIN) {
      return SCREEN_NAMES.ADMIN_DASHBOARD;
    }
    return SCREEN_NAMES.ENTRANCE_HOME;
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRoute()}
        screenOptions={defaultScreenOptions}
      >
        <Stack.Screen name={SCREEN_NAMES.SETUP} component={SetupScreen} />
        <Stack.Screen
          name={SCREEN_NAMES.ADMIN_DASHBOARD}
          component={AdminDashboard}
        />
        <Stack.Screen
          name={SCREEN_NAMES.REGISTER_PERSON}
          component={RegisterPerson}
          options={adminScreenOptions}
        />
        <Stack.Screen
          name={SCREEN_NAMES.PERSON_LIST}
          component={PersonList}
          options={{ ...adminScreenOptions, title: 'People' }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.TEST_RECOGNITION}
          component={TestRecognition}
          options={{ ...adminScreenOptions, title: 'Test Recognition' }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.LOGS}
          component={Logs}
          options={{ ...adminScreenOptions, title: 'Logs' }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.SETTINGS}
          component={Settings}
          options={{ ...adminScreenOptions, title: 'Settings' }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.ENTRANCE_HOME}
          component={EntranceHome}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
