import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Typography, Spacing } from '../../theme';
import DatabaseService from '../../database/DatabaseService';

function Logs() {
  const [logs, setLogs] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const data = DatabaseService.getLogs(100);
      setLogs(data);
    }, []),
  );

  const renderItem = ({ item }) => {
    const isRecognized = item.recognized === 1;

    return (
      <View style={[styles.logCard, isRecognized ? styles.logSuccess : styles.logFail]}>
        <View style={styles.logHeader}>
          <Text style={styles.logIcon}>{isRecognized ? '✅' : '❌'}</Text>
          <View style={styles.logInfo}>
            <Text style={styles.logName}>{item.personName}</Text>
            <Text style={styles.logConfidence}>
              {(item.confidence * 100).toFixed(1)}% confidence
            </Text>
          </View>
        </View>
        <Text style={styles.logDate}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {logs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No recognition logs yet</Text>
        </View>
      ) : (
        <FlatList
          data={logs}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  list: {
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  logCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
  },
  logSuccess: {
    borderLeftColor: Colors.success,
  },
  logFail: {
    borderLeftColor: Colors.error,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  logInfo: {
    flex: 1,
  },
  logName: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  logConfidence: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logDate: {
    ...Typography.caption,
    color: Colors.textLight,
    marginTop: Spacing.sm,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});

export default Logs;
