import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {SIZES, FONTS, COLORS} from '@constants/theme';
import {Phrase} from '@components';
import {category} from '@constants/images';
import {forwardArrow} from '@constants/icons';
import * as RootNavigation from '@navigators/RootNavigation';

const CategoryWidget = ({
  name,
  img,
  slug,
  bgColor = 'lime',
  ...containerStyle
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, {backgroundColor: bgColor}]}
      onPress={() => {
        RootNavigation.navigate('ProductListing', {
          namE: name,
          slug: slug,
          type: 'category',
        });
      }}>
      <View style={styles.innerContainer}>
        <View style={styles.leftView}>
          <Phrase txt={name} txtStyle={styles.txt} />
        </View>
        <View style={styles.rightView}>
          <Image source={{uri: img}} style={styles.catImg} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.fourtyFive,
    height: 100,
    borderRadius: SIZES.minor,
    // padding: SIZES.radius,
    marginTop: SIZES.padding,
    overflow: 'visible',
  },
  innerContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  leftView: {
    width: SIZES.fourtyFive,
    justifyContent: 'center',
    height: 100,
    paddingLeft: SIZES.radius,
  },
  txt: {...FONTS.body3_bold, color: COLORS.white},
  rightView: {
    width: SIZES.fifty,
    justifyContent: 'center',
    height: 100,
  },
  catImg: {
    width: 120,
    bottom: 0,
    height: 100,
    aspectRatio: 0.8,
    resizeMode: 'contain',
  },
});
export default CategoryWidget;
