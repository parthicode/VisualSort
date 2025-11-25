/**
 * Home Screen - Display all activities in a grid
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { HomeScreenProps } from '../../types/navigation';
import { useAppStore } from '../../store/useAppStore';
import { Activity } from '../../types/models';

const { width } = Dimensions.get('window');
const TILE_PADDING = 16;
const TILE_GAP = 16;
const COLUMNS = 2;
const TILE_WIDTH = (width - TILE_PADDING * 2 - TILE_GAP * (COLUMNS - 1)) / COLUMNS;

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { activities, fetchActivities, deleteActivity, deleteAllData } = useAppStore();

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleTilePress = (activityId: string) => {
    navigation.navigate('SortingScreen', { activityId });
  };

  const handleTileLongPress = (activity: Activity) => {
    Alert.alert(
      'Delete Activity',
      `Delete "${activity.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteActivity(activity.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete activity');
            }
          },
        },
      ]
    );
  };

  const handleCreateActivity = () => {
    navigation.navigate('CreateActivityModal');
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'This will delete all activities and images. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAllData();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete all data');
            }
          },
        },
      ]
    );
  };

  const renderActivityTile = ({ item }: { item: Activity | 'create' }) => {
    if (item === 'create') {
      return (
        <TouchableOpacity
          style={[styles.tile, styles.createTile]}
          onPress={handleCreateActivity}
          activeOpacity={0.7}
        >
          <View style={styles.tileContent}>
            <Text style={styles.createTileText}>+</Text>
            <Text style={styles.createTileLabel}>Create New</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.tile}
        onPress={() => handleTilePress(item.id)}
        onLongPress={() => handleTileLongPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.tileContent}>
          <Text style={styles.tileTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.tileSubtitle}>
            {item.columns.length} {item.columns.length === 1 ? 'column' : 'columns'}
          </Text>
          <Text style={styles.tileSubtitle}>
            {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>Tap + to create your first sorting game</Text>
    </View>
  );

  const dataWithCreate = ['create' as const, ...activities];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VisualSort</Text>
        {__DEV__ && (
          <TouchableOpacity
            style={styles.devButton}
            onPress={handleDeleteAllData}
            onLongPress={() => {
              Alert.alert('Dev Menu', 'Long press to clear all data');
            }}
          >
            <Text style={styles.devButtonText}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={dataWithCreate}
        renderItem={renderActivityTile}
        keyExtractor={(item) => (item === 'create' ? 'create' : item.id)}
        numColumns={COLUMNS}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#42A5F5',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  devButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  devButtonText: {
    fontSize: 20,
  },
  listContent: {
    padding: TILE_PADDING,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: TILE_GAP,
  },
  tile: {
    width: TILE_WIDTH,
    aspectRatio: 1.67, // Reduced height by 40% (1 / 0.6 = 1.67)
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  createTile: {
    backgroundColor: '#42A5F5',
  },
  tileContent: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createTileText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  createTileLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
    textAlign: 'center',
  },
  tileTitle: {
    fontSize: 21, // Increased by 50% (14 * 1.5 = 21)
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
    textAlign: 'center',
  },
  tileSubtitle: {
    fontSize: 11,
    color: '#757575',
    marginTop: 2,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
});

export default HomeScreen;
