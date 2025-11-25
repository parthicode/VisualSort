/**
 * Navigation type definitions for React Navigation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  CreateActivityModal: undefined;
  SortingScreen: {
    activityId: string;
  };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type CreateActivityModalProps = NativeStackScreenProps<RootStackParamList, 'CreateActivityModal'>;
export type SortingScreenProps = NativeStackScreenProps<RootStackParamList, 'SortingScreen'>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
