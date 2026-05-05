import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { SIZES, FONTS, COLORS } from '@constants/theme';
import { Phrase } from '@components';
import { category } from '@constants/images';
import { forwardArrow } from '@constants/icons';
import * as RootNavigation from '@navigators/RootNavigation';
import { LanguageContext } from '../../store/LanguageContext';
import { getLocalizedName } from '../../helpers/localizedEntity';

const BrandTile = ({ item }) => {
  const { language } = useContext(LanguageContext);
  const label = getLocalizedName(item, language);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        RootNavigation.navigate('ProductListing', { namE: label, slug: item.slug, type: 'brand' });
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
