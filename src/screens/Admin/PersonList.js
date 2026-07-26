import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Typography, Spacing } from '../../theme';
import { SCREEN_NAMES } from '../../constants';
import DatabaseService from '../../database/DatabaseService';

function PersonList({ navigation }) {
  const [people, setPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadPeople();
    }, []),
  );

  const loadPeople = () => {
    const persons = DatabaseService.getPersons();
    setPeople(persons);
  };

  const filteredPeople = searchQuery
    ? people.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : people;

  const handleStartEdit = (person) => {
    setEditingId(person.id);
    setEditName(person.name);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    DatabaseService.updatePerson(editingId, editName.trim());
    setEditingId(null);
    setEditName('');
    loadPeople();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = (person) => {
    Alert.alert(
      'Delete Person',
      `Are you sure you want to delete "${person.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            DatabaseService.deletePerson(person.id);
            loadPeople();
          },
        },
      ],
    );
  };

  const handleReRegister = (person) => {
    navigation.navigate(SCREEN_NAMES.REGISTER_PERSON, {
      personId: person.id,
      personName: person.name,
    });
  };

  const renderItem = ({ item }) => {
    const isEditing = editingId === item.id;

    return (
      <View style={styles.personCard}>
        <View style={styles.personInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.personDetails}>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={editName}
                onChangeText={setEditName}
                autoFocus
              />
            ) : (
              <Text style={styles.personName}>{item.name}</Text>
            )}
            <Text style={styles.personDate}>
              Registered: {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleSaveEdit}
              >
                <Text style={styles.actionSave}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleCancelEdit}
              >
                <Text style={styles.actionCancel}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleReRegister(item)}
              >
                <Text style={styles.actionReReg}>Re-register</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleStartEdit(item)}
              >
                <Text style={styles.actionEdit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDelete(item)}
              >
                <Text style={styles.actionDelete}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by name..."
        placeholderTextColor={Colors.textLight}
      />
      {filteredPeople.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'No people match your search'
              : 'No registered people yet'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPeople}
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
  searchInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  list: {
    paddingBottom: Spacing.xxl,
  },
  personCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  personInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    ...Typography.h4,
    color: Colors.white,
  },
  personDetails: {
    flex: 1,
  },
  personName: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  personDate: {
    ...Typography.caption,
    color: Colors.textLight,
    marginTop: 2,
  },
  editInput: {
    ...Typography.body,
    color: Colors.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    paddingVertical: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionEdit: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  actionSave: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: '600',
  },
  actionCancel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  actionDelete: {
    ...Typography.caption,
    color: Colors.error,
    fontWeight: '600',
  },
  actionReReg: {
    ...Typography.caption,
    color: Colors.warning,
    fontWeight: '600',
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

export default PersonList;
