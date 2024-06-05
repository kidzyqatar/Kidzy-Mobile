import {View, Text} from 'react-native';
import React from 'react';
import {COLORS, SIZES} from '@constants/theme';

const Hr = ({type = 'lg'}) => {
  if (type == 'lg') {
    return (
      <View
        style={{
          marginTop: SIZES.padding,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.grayLight,
        }}
      />
    );
  } else {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: COLORS.grayLight,
        }}
      />
    );
  }
};

export default Hr;
