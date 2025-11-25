/**
 * Debug Panel - Shows console logs directly in the app
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'log' | 'error' | 'warn';
}

const logs: LogEntry[] = [];
const MAX_LOGS = 100;

// Override console methods to capture logs
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = (...args: any[]) => {
  originalLog(...args);
  addLog('log', args.join(' '));
};

console.error = (...args: any[]) => {
  originalError(...args);
  addLog('error', args.join(' '));
};

console.warn = (...args: any[]) => {
  originalWarn(...args);
  addLog('warn', args.join(' '));
};

function addLog(type: 'log' | 'error' | 'warn', message: string) {
  logs.push({
    timestamp: new Date().toLocaleTimeString(),
    message,
    type,
  });
  
  if (logs.length > MAX_LOGS) {
    logs.shift();
  }
}

export const DebugPanel: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!__DEV__) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setVisible(!visible)}
      >
        <Text style={styles.toggleButtonText}>
          {visible ? '📋 Hide Logs' : '📋 Show Logs'}
        </Text>
      </TouchableOpacity>

      {/* Debug Panel */}
      {visible && (
        <View style={styles.panel}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Debug Logs ({logs.length})</Text>
            <TouchableOpacity
              onPress={() => {
                logs.length = 0;
                forceUpdate(prev => prev + 1);
              }}
            >
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.logContainer}>
            {logs.map((log, index) => (
              <View
                key={index}
                style={[
                  styles.logEntry,
                  log.type === 'error' && styles.logError,
                  log.type === 'warn' && styles.logWarn,
                ]}
              >
                <Text style={styles.timestamp}>{log.timestamp}</Text>
                <Text style={styles.logText}>{log.message}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 9999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  toggleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  panel: {
    position: 'absolute',
    bottom: 70,
    left: 10,
    right: 10,
    height: 300,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    zIndex: 9998,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  clearButton: {
    color: '#FF5252',
    fontSize: 12,
    fontWeight: '600',
  },
  logContainer: {
    flex: 1,
  },
  logEntry: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  logError: {
    backgroundColor: '#3D1F1F',
  },
  logWarn: {
    backgroundColor: '#3D3A1F',
  },
  timestamp: {
    color: '#888',
    fontSize: 10,
    marginBottom: 2,
  },
  logText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'monospace',
  },
});

export default DebugPanel;
