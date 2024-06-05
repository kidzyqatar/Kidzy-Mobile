import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { checked, unchecked } from '@constants/icons';
import { Phrase } from '@components';
import globalStyles from '@constants/global-styles';
import { SIZES, FONTS } from '@constants/theme';

const Checkbox = ({ state, stateChanger, label }) => {
  return (
    <View style={globalStyles.row}>
      <TouchableOpacity
        onPress={() => {
          stateChanger(!state);
        }}>
        <Image source={state ? checked : unchecked} style={styles.box} />
      </TouchableOpacity>
      <Phrase txt={label} txtStyle={{ ...FONTS.body6_medium }} />
    </View>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  box: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: SIZES.radius,
  },
});
