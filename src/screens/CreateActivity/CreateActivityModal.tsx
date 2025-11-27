/**
 * Create Activity Modal - Form for creating new sorting activities
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { CreateActivityModalProps } from '../../types/navigation';
import { useAppStore } from '../../store/useAppStore';

const MIN_COLUMNS = 2;
const MAX_COLUMNS = 6;
const MAX_TITLE_LENGTH = 25;

export const CreateActivityModal: React.FC<CreateActivityModalProps> = ({ navigation }) => {
  const { addActivity } = useAppStore();

  const [activityTitle, setActivityTitle] = useState('');
  const [orientation, setOrientation] = useState<'column' | 'row'>('column');
  const [columnCount, setColumnCount] = useState(3);
  const [columnTitles, setColumnTitles] = useState<string[]>(
    Array(3).fill('')
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleColumnCountChange = (newCount: number) => {
    if (newCount < MIN_COLUMNS || newCount > MAX_COLUMNS) return;

    setColumnCount(newCount);
    
    // Adjust column titles array
    const newTitles = [...columnTitles];
    if (newCount > columnTitles.length) {
      // Add empty strings for new columns
      while (newTitles.length < newCount) {
        newTitles.push('');
      }
    } else {
      // Trim excess columns
      newTitles.length = newCount;
    }
    setColumnTitles(newTitles);
  };

  const handleColumnTitleChange = (index: number, value: string) => {
    const newTitles = [...columnTitles];
    newTitles[index] = value;
    setColumnTitles(newTitles);
    
    // Clear error for this field
    if (errors[`column${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`column${index}`];
      setErrors(newErrors);
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate activity title
    if (!activityTitle.trim()) {
      newErrors.activityTitle = 'Activity title is required';
    } else if (activityTitle.length > MAX_TITLE_LENGTH) {
      newErrors.activityTitle = `Title must be ${MAX_TITLE_LENGTH} characters or less`;
    }

    // Validate column titles
    columnTitles.forEach((title, index) => {
      if (!title.trim()) {
        newErrors[`column${index}`] = 'Column title is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) {
      return;
    }

    try {
      await addActivity(activityTitle.trim(), columnTitles.map(t => t.trim()), orientation);
      
      // Get the newly created activity ID
      const currentActivityId = useAppStore.getState().currentActivityId;
      
      // Close the modal first
      navigation.goBack();
      
      // Then navigate to the new activity (this will be from Home screen)
      if (currentActivityId) {
        // Use a small delay to ensure modal is closed first
        setTimeout(() => {
          navigation.navigate('SortingScreen', { activityId: currentActivityId });
        }, 100);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create activity');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const isFormValid = 
    activityTitle.trim().length > 0 &&
    activityTitle.length <= MAX_TITLE_LENGTH &&
    columnTitles.every(title => title.trim().length > 0);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Activity Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Activity Title</Text>
          <TextInput
            style={[styles.input, errors.activityTitle && styles.inputError]}
            value={activityTitle}
            onChangeText={(text) => {
              setActivityTitle(text);
              if (errors.activityTitle) {
                const newErrors = { ...errors };
                delete newErrors.activityTitle;
                setErrors(newErrors);
              }
            }}
            placeholder="Enter activity title"
            maxLength={MAX_TITLE_LENGTH}
          />
          <Text style={styles.charCount}>
            {activityTitle.length}/{MAX_TITLE_LENGTH}
          </Text>
          {errors.activityTitle && (
            <Text style={styles.errorText}>{errors.activityTitle}</Text>
          )}
        </View>

        {/* Orientation Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>Layout Orientation</Text>
          <View style={styles.orientationContainer}>
            <TouchableOpacity
              style={[
                styles.orientationButton,
                orientation === 'column' && styles.orientationButtonActive,
              ]}
              onPress={() => setOrientation('column')}
            >
              <Text
                style={[
                  styles.orientationButtonText,
                  orientation === 'column' && styles.orientationButtonTextActive,
                ]}
              >
                Columns
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.orientationButton,
                orientation === 'row' && styles.orientationButtonActive,
              ]}
              onPress={() => setOrientation('row')}
            >
              <Text
                style={[
                  styles.orientationButtonText,
                  orientation === 'row' && styles.orientationButtonTextActive,
                ]}
              >
                Rows
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Column Count Picker */}
        <View style={styles.section}>
          <Text style={styles.label}>Number of {orientation === 'column' ? 'Columns' : 'Rows'}</Text>
          <View style={styles.pickerContainer}>
            {[2, 3, 4, 5, 6].map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.pickerButton,
                  columnCount === count && styles.pickerButtonActive,
                ]}
                onPress={() => handleColumnCountChange(count)}
              >
                <Text
                  style={[
                    styles.pickerButtonText,
                    columnCount === count && styles.pickerButtonTextActive,
                  ]}
                >
                  {count}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Column/Row Titles */}
        <View style={styles.section}>
          <Text style={styles.label}>{orientation === 'column' ? 'Column' : 'Row'} Titles</Text>
          {columnTitles.map((title, index) => (
            <View key={index} style={styles.columnTitleContainer}>
              <Text style={styles.columnLabel}>{orientation === 'column' ? 'Column' : 'Row'} {index + 1}</Text>
              <TextInput
                style={[
                  styles.input,
                  errors[`column${index}`] && styles.inputError,
                ]}
                value={title}
                onChangeText={(text) => handleColumnTitleChange(index, text)}
                placeholder={`Enter ${orientation === 'column' ? 'column' : 'row'} ${index + 1} title`}
              />
              {errors[`column${index}`] && (
                <Text style={styles.errorText}>{errors[`column${index}`]}</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.createButton,
            !isFormValid && styles.createButtonDisabled,
          ]}
          onPress={handleCreate}
          disabled={!isFormValid}
        >
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212121',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#F44336',
  },
  charCount: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'right',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 4,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  pickerButtonActive: {
    backgroundColor: '#42A5F5',
    borderColor: '#42A5F5',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#212121',
  },
  pickerButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  orientationContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  orientationButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  orientationButtonActive: {
    backgroundColor: '#42A5F5',
    borderColor: '#42A5F5',
  },
  orientationButtonText: {
    fontSize: 16,
    color: '#212121',
  },
  orientationButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  columnTitleContainer: {
    marginBottom: 16,
  },
  columnLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#BDBDBD',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  createButton: {
    backgroundColor: '#42A5F5',
  },
  createButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default CreateActivityModal;
