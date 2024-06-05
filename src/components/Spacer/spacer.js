import {View, Text} from 'react-native';
import React from 'react';
import {SIZES} from '@constants/theme';

const Spacer = ({size = 'md'}) => {
  if (size == 'md') return <View style={{height: SIZES.radius}} />;
  else return <View style={{height: SIZES.padding * 1.5}} />;
};

export default Spacer;
