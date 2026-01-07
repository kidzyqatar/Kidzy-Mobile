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
      style={[styles.container, {backgroundColor: bgColor,}]}
      onPress={() => {
        RootNavigation.navigate('ProductListing', {
          namE: name,
          slug: slug,
          type: 'category',
        });
      }}>
      <View style={styles.innerContainer}>
        <View style={styles.leftView}>
          <Phrase txt={`${name}`} txtStyle={styles.txt} />
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
    // width: SIZES.fourtyFive,
    flex:1,
    // height: 120,
    borderRadius: SIZES.minor,
    marginHorizontal: SIZES.base,
    // padding: SIZES.radius,
    // padding: SIZES.radius,
    // marginTop: 0,
    // overflow: 'visible',
  },
  innerContainer: {
    flex:1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  leftView: {
    flex:0.5,
    // width: SIZES.fourtyFive,
    justifyContent: 'center',
    // height: 120,
    paddingLeft: SIZES.base,
  },
  txt: {...FONTS.body3_bold, color: COLORS.white},
  rightView: {
    flex:0.5,
    // backgroundColor:"red",
    // width: SIZES.fifty,
    justifyContent: 'center',
    // padding:SIZES.radius
    // height: 120,
  },
  catImg: {
    // width: 120,
    // bottom: 0,
    // paddingRight:40,
    // backgroundColor:"blue",
    // width:100,
    height: 100,
    // flex:1,
    // aspectRatio: 0.8,
    // resizeMode: 'contain',
  },
});
export default CategoryWidget;
