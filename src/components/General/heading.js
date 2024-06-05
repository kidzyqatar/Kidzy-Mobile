import React from 'react';
import {FONTS, COLORS} from '@constants/theme';
import {Text} from 'react-native';

export default function Heading({txt, txtStyle}) {
  return <Text style={{color: COLORS.black, ...txtStyle}}>{txt}</Text>;
}
