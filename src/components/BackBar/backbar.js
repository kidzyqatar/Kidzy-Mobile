import React from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { FONTS, COLORS, SIZES } from '@constants/theme';
import { Heading, Phrase, MasterLayout } from '@components';
import { back } from '@constants/icons';
import * as RootNavigation from '@navigators/RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setCart, setCartSessionID } from '../../store/reducers/global';

const BackBar = ({
  title,
  showBack = true,
  navigateTo = null,
  right = false,
  showCaseView = false,
}) => {
  const global = useSelector(state => state.global);
  const dispatch = useDispatch();

  if (!showCaseView) {
    return (
      <View style={styles.mainView}>
        <TouchableOpacity
          style={styles.leftView}
          onPress={() => {
            if (navigateTo != null) {
              RootNavigation.navigate(navigateTo);
            }
          }}>
          {showBack && <Image source={back} style={styles.cartViewImage} />}
          <Heading txt={title} txtStyle={styles.heading} />
        </TouchableOpacity>
        {right && (
          <TouchableOpacity style={styles.rightView} onPress={() => {
            dispatch(setCart(null))
            RootNavigation.back()
          }}>
            <Phrase txt={'Clear All'} txtStyle={styles.linkTxt} />
          </TouchableOpacity>
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.mainView}>
        <View style={styles.leftView}>
          {showBack && <Image source={back} style={styles.cartViewImage} />}
          <Heading txt={title} txtStyle={styles.heading} />
        </View>
        {right && (
          <View style={styles.rightView}>
            <Phrase txt={'Clear All'} txtStyle={styles.linkTxt} />
          </View>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: { ...FONTS.body2_medium, color: COLORS.black },
  cartViewImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: SIZES.radius,
  },
  leftView: { width: SIZES.eighty, flexDirection: 'row', alignItems: 'center' },
  rightView: { width: SIZES.twenty },
  linkTxt: { color: COLORS.secondary, ...FONTS.body4_bold },
});
export default BackBar;
