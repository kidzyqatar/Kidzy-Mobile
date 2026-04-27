// src/components/WhatsAppBubble.js

import React, {useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  Linking,
  Alert,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';

const WHATSAPP_NUMBER = '97430004848';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const WhatsAppBubble = ({
  initialBottom = 100,
  initialRight = 20,
}) => {
  const [position] = useState(
    new Animated.ValueXY({
      x: SCREEN_WIDTH - initialRight - 60, // 60 is icon width
      y: SCREEN_HEIGHT - initialBottom - 60, // 60 is icon height
    }),
  );

  const lastTap = useRef(null);

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
            ],
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
          [{text: 'OK'}],
        );
      }
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        position.setOffset({
          x: position.x._value,
          y: position.y._value,
        });
        position.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event(
        [null, {dx: position.x, dy: position.y}],
        {useNativeDriver: false},
      ),
      onPanResponderRelease: (e, gesture) => {
        position.flattenOffset();

        // Detect tap (no significant movement)
        const {dx, dy} = gesture;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 10) {
          // It's a tap, not a drag
          const now = Date.now();
          const DOUBLE_TAP_DELAY = 300;

          if (lastTap.current && now - lastTap.current < DOUBLE_TAP_DELAY) {
            // Double tap - do nothing or add special action
            lastTap.current = null;
          } else {
            // Single tap - open WhatsApp
            lastTap.current = now;
            setTimeout(() => {
              if (lastTap.current === now) {
                openWhatsApp();
              }
            }, DOUBLE_TAP_DELAY);
          }
        }

        // Keep icon within screen bounds
        const maxX = SCREEN_WIDTH - 60;
        const maxY = SCREEN_HEIGHT - 60;

        let finalX = position.x._value;
        let finalY = position.y._value;

        if (finalX < 0) finalX = 0;
        if (finalX > maxX) finalX = maxX;
        if (finalY < 0) finalY = 0;
        if (finalY > maxY) finalY = maxY;

        Animated.spring(position, {
          toValue: {x: finalX, y: finalY},
          useNativeDriver: false,
          friction: 7,
        }).start();
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: position.getTranslateTransform(),
        },
      ]}
      {...panResponder.panHandlers}>
      <Image
        source={require('../assets/icons/whatsapp.webp')}
        style={styles.icon}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
    width: 60,
    height: 60,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

export default WhatsAppBubble;
