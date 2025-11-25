/**
 * Main navigation structure for VisualSort
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Import screens
import HomeScreen from '../screens/Home/HomeScreen';
import CreateActivityModal from '../screens/CreateActivity/CreateActivityModal';
import SortingScreen from '../screens/Sorting/SortingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // Hide default headers - we use custom ones
        }}
      >
        {/* Home Screen - Root */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        {/* Create Activity Modal */}
        <Stack.Screen
          name="CreateActivityModal"
          component={CreateActivityModal}
          options={{
            presentation: 'modal',
            headerShown: true, // Show header for modal
            title: 'Create Activity',
          }}
        />

        {/* Sorting Screen */}
        <Stack.Screen
          name="SortingScreen"
          component={SortingScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
