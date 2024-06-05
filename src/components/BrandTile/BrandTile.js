import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { SIZES, FONTS, COLORS } from '@constants/theme';
import { Phrase } from '@components';
import { category } from '@constants/images';
import { forwardArrow } from '@constants/icons';
import * as RootNavigation from '@navigators/RootNavigation';

const BrandTile = ({ item }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        RootNavigation.navigate('ProductListing', { namE: item.name, slug: item.slug, type: 'brand' });
      }}>
      <Image source={{ uri: item.full_image }} style={styles.img} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 90,
    height: 90,
    borderRadius: 90,
    marginHorizontal: SIZES.base,
    marginTop: SIZES.padding,
  },
  img: { width: 90, height: 90, resizeMode: 'contain' },
});
export default BrandTile;
