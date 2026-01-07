import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Phrase} from '@components';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import globalStyles from '../../constants/global-styles';

const Chip = ({status, bgColor, txtColor, icon = null, customStyle}) => {
  // Ensure valid colors - fallback to defaults if empty
  const validBgColor = bgColor || COLORS.grayLight + '1A';
  const validTxtColor = txtColor || COLORS.gray;
  
  return (
    <View
      style={[
        globalStyles.rowView,
        styles.orderItemChip,
        {backgroundColor: validBgColor, ...customStyle},
      ]}>
      <Phrase txt={status} txtStyle={{color: validTxtColor, ...FONTS.body6}} />
      {icon !== null && <Image source={icon} style={styles.iconImg} />}
    </View>
  );
};
const styles = StyleSheet.create({
  orderItemChip: {
    width: 'auto',
    paddingHorizontal: SIZES.base,
    paddingVertical: 2,
    margin: 0,
    alignItems: 'center',
    borderRadius: SIZES.base,
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImg: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    marginLeft: SIZES.radius,
    tintColor: COLORS.success,
  },
});

export default Chip;
