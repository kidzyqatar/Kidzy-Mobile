// src/components/WhatsAppBubble.js

import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet, Linking} from 'react-native';

const WhatsAppBubble = () => {
  const openWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=97430004848');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openWhatsApp}>
        <Image
          source={require('../assets/icons/whatsapp.webp')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 1000,
  },
  icon: {
    width: 60,
    height: 60,
  },
});

export default WhatsAppBubble;
