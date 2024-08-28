// MasterLayout.js

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {COLORS, SIZES} from '@constants/theme';
import {SafeAreaView} from 'react-native-safe-area-context';

const MasterLayout = ({
  children,
  scrolling = false,
  bgColor = COLORS.white,
  header,
  footer,
  max = false,
}) => {
  return (
    <SafeAreaView
      style={[styles.safeAreaView, {backgroundColor: bgColor}]}
      edges={['right', 'left', 'top']}>
      {header && <View style={styles.header}>{header}</View>}
      {scrolling ? (
        <ScrollView
          scrollEnabled={scrolling}
          contentContainerStyle={[
            styles.scrollContent,
            {
              backgroundColor: bgColor,
              padding: max ? 0 : 16,
              paddingBottom: 16,
            },
          ]}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Main Content */}
          <View>{children}</View>
        </ScrollView>
      ) : (
        <View
          style={[
            styles.content,
            {backgroundColor: bgColor, padding: max ? 0 : 16},
          ]}>
          {/* Main Content */}
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    zIndex: 1000,
  },

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeAreaView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    // flexGrow: 1,
    // justifyContent: 'space-between',
  },
  footer: {
    // Your footer styles
  },
});

export default MasterLayout;
