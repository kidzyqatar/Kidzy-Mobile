import {View, Text} from 'react-native';
import React from 'react';
import {IconButton} from 'react-native-paper';
import {SIZES, COLORS} from '@constants/theme';

const IconBtn = ({icon, onPress = () => {}}) => {
  return (
    <IconButton
      icon={icon}
      size={25}
      style={{
        borderWidth: 1,
        borderColor: COLORS.grayLight,
        backgroundColor: COLORS.bgGray,
        borderRadius: SIZES.minor,
      }}
      onPress={onPress}
    />
  );
};

export default IconBtn;
