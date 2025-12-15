/**
 * VisualSort - Main App Entry Point
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import DebugPanel from './src/components/DebugPanel';
import { ImageZoomProvider } from './src/contexts/ImageZoomContext';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ImageZoomProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppNavigator />
          <DebugPanel />
        </ImageZoomProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
