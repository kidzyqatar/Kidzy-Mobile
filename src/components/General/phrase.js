import React from 'react';
import {COLORS, FONTS} from '@constants/theme';
import {Text} from 'react-native';

export default function Phrase({txt, txtStyle, numberOfLines}) {
  return (
    <Text
      style={{...FONTS.body4, color: COLORS.black, ...txtStyle}}
      numberOfLines={numberOfLines}>
      {txt}
    </Text>
  );
}
