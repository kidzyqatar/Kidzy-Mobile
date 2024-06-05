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
    <SafeAreaView style={[styles.safeAreaView, {backgroundColor: bgColor}]}>
      {scrolling ? (
        <ScrollView
          scrollEnabled={scrolling}
          contentContainerStyle={[
            styles.scrollContent,
            {backgroundColor: bgColor, padding: max ? 0 : 16},
          ]}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Main Content */}
          {children}
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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeAreaView: {flex: 1},
  header: {
    // Your header styles
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
