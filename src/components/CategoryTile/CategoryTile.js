import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { SIZES, FONTS, COLORS } from '@constants/theme';
import { Phrase } from '@components';
import { category } from '@constants/images';
import { forwardArrow } from '@constants/icons';
import * as RootNavigation from '@navigators/RootNavigation';

const CategoryTile = ({ item }) => {
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        RootNavigation.navigate('ProductListing', { namE: item.name, slug: item.slug, type: 'category' });
      }}>
      <View style={styles.innerContainer}>
        <View style={styles.leftView}>
          <Phrase txt={item.name} txtStyle={styles.txt} numberOfLine={2} />
          <Image source={forwardArrow} style={styles.img} />
        </View>
        <View style={styles.rightView}>
          <Image source={{ uri: item.full_image }} style={styles.catImg} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.fourtyFive,
    height: 100,
    backgroundColor: COLORS.categoryBackground,
    borderRadius: SIZES.minor,
    padding: SIZES.radius,
    marginHorizontal: SIZES.base,
    marginTop: SIZES.padding,
  },
  innerContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  leftView: { width: SIZES.fifty, justifyContent: 'space-between' },
  txt: { ...FONTS.body4_bold },
  img: { marginBottom: SIZES.radius, width: 15, height: 15 },
  rightView: { width: SIZES.fifty },
  catImg: {
    width: SIZES.hundred,
    height: 120,
    resizeMode: 'contain',
    marginTop: -SIZES.padding * 1.5,
  },
});
export default CategoryTile;
