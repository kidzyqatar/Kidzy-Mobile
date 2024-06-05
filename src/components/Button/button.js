import {View, Text, Image} from 'react-native';
import React from 'react';
import {Button} from 'react-native-paper';
import {COLORS, SIZES} from '@constants/theme';

const MyButton = ({
  btnStyle,
  label,
  icon,
  iconPosition = 'left',
  btnColor,
  borderColor = 'transparent',
  txtColor = COLORS.white,
  onPress = () => {},
}) => {
  if (typeof icon !== 'undefined') {
    return (
      <Button
        mode="contained"
        style={{
          width: SIZES.hundred,
          height: 44,
          borderWidth: 1,
          borderColor: borderColor,
          marginTop: SIZES.radius,
          ...btnStyle,
        }}
        contentStyle={{
          flexDirection: iconPosition == 'left' ? 'row' : 'row-reverse',
        }}
        textColor={txtColor}
        icon={() => (
          <Image
            source={icon}
            style={{
              width: 15,
              height: 15,
              resizeMode: 'contain',
            }}
          />
        )}
        buttonColor={btnColor}
        onPress={() => {
          onPress();
        }}>
        {label}
      </Button>
    );
  } else {
    return (
      <Button
        mode="contained"
        style={{
          width: SIZES.hundred,
          height: 44,
          borderWidth: 1,
          borderColor: borderColor,
          marginTop: SIZES.radius,
          ...btnStyle,
        }}
        buttonColor={btnColor}
        textColor={txtColor}
        onPress={() => {
          onPress();
        }}>
        {label}
      </Button>
    );
  }
};

export default MyButton;
