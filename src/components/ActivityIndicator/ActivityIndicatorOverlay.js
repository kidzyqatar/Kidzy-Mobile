import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const ActivityIndicatorOverlay = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white background
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActivityIndicatorOverlay;