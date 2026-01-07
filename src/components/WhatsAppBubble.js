// src/components/WhatsAppBubble.js

import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet, Linking, Alert, Platform} from 'react-native';

const WHATSAPP_NUMBER = '97430004848';

const WhatsAppBubble = () => {
  const openWhatsApp = async () => {
    const whatsappUrl = `whatsapp://send?phone=${WHATSAPP_NUMBER}`;
    const webUrl = `https://wa.me/${WHATSAPP_NUMBER}`;
    
    try {
      // Check if WhatsApp is installed
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        // WhatsApp not installed, try web URL
        const canOpenWeb = await Linking.canOpenURL(webUrl);
        
        if (canOpenWeb) {
          await Linking.openURL(webUrl);
        } else {
          Alert.alert(
            'WhatsApp Not Available',
            'Please install WhatsApp to contact us, or call us directly.',
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Call Now',
                onPress: () => Linking.openURL(`tel:+${WHATSAPP_NUMBER}`),
              },
            ]
          );
        }
      }
    } catch (error) {
      console.log('Error opening WhatsApp:', error);
      // Fallback to web URL
      try {
        await Linking.openURL(webUrl);
      } catch (webError) {
        Alert.alert(
          'Error',
          'Unable to open WhatsApp. Please try again later.',
          [{text: 'OK'}]
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openWhatsApp} activeOpacity={0.7}>
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
