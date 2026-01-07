// MasterLayout.js

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
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
  statusBarColor = null, // New prop for status bar color
  statusBarStyle = 'dark-content', // 'light-content' or 'dark-content'
}) => {
  // Use statusBarColor if provided, otherwise use bgColor
  const effectiveStatusBarColor = statusBarColor || bgColor;
  
  return (
    <View style={{flex: 1, backgroundColor: effectiveStatusBarColor}}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={effectiveStatusBarColor}
        translucent={false}
      />
      <SafeAreaView
        style={[styles.safeAreaView, {backgroundColor: effectiveStatusBarColor}]}
        edges={['top']}>
        {header && <View style={styles.header}>{header}</View>}
        <View style={[styles.contentWrapper, {backgroundColor: bgColor}]}>
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
        </View>
      </SafeAreaView>
    </View>
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
  contentWrapper: {
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
