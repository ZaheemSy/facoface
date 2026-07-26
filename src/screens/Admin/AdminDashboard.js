import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '../../theme';
import { SCREEN_NAMES } from '../../constants';
import useAppStore from '../../store/useAppStore';
import DatabaseService from '../../database/DatabaseService';

function AdminDashboard({ navigation }) {
  const people = useAppStore((state) => state.people);
  const setPeople = useAppStore((state) => state.setPeople);

  useEffect(() => {
    const persons = DatabaseService.getPersons();
    setPeople(persons);
  }, [setPeople]);

  const menuItems = [
    {
      label: 'Register Person',
      icon: '➕',
      screen: SCREEN_NAMES.REGISTER_PERSON,
    },
    {
      label: 'People',
      icon: '👥',
      screen: SCREEN_NAMES.PERSON_LIST,
    },
    {
      label: 'Test Recognition',
      icon: '🧪',
      screen: SCREEN_NAMES.TEST_RECOGNITION,
    },
    {
      label: 'Logs',
      icon: '📋',
      screen: SCREEN_NAMES.LOGS,
    },
    {
      label: 'Settings',
      icon: '⚙️',
      screen: SCREEN_NAMES.SETTINGS,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Total Registered</Text>
        <Text style={styles.cardValue}>{people.length}</Text>
      </View>
      <View style={styles.menu}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  cardLabel: {
    ...Typography.body,
    color: Colors.white,
    opacity: 0.9,
  },
  cardValue: {
    ...Typography.h1,
    color: Colors.white,
    marginTop: Spacing.xs,
  },
  menu: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  menuIcon: {
    fontSize: 22,
    marginRight: Spacing.md,
  },
  menuLabel: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  menuArrow: {
    fontSize: 22,
    color: Colors.textLight,
  },
});

export default AdminDashboard;
