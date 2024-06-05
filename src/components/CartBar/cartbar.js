import React, { useEffect, useState } from 'react';
import { Image, Text, View, StyleSheet, Alert } from 'react-native';
import { FONTS, COLORS, SIZES } from '@constants/theme';
import { Heading, Phrase, MasterLayout } from '@components';
import { cart } from '@constants/icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import * as RootNavigation from '@navigators/RootNavigation';

const CartBar = ({ title, showCart = true }) => {
  const global = useSelector(state => state.global);
  const [cartCount, setCartCount] = useState(global.cart?.order_items?.length ?? 0);

  useEffect(() => {
    setCartCount(global.cart?.order_items?.length ?? 0)
    console.log('I am called home')
  }, [global.cart])

  return (
    <View style={styles.mainView}>
      <Heading txt={title} txtStyle={styles.heading} />
      {showCart && (
        <TouchableOpacity
          style={styles.cartView}
          onPress={() => {
            if (cartCount > 0) {
              RootNavigation.navigate('MyCart');
            } else {
              Alert.alert('Empty cart', 'Please add items to your cart')
            }

          }}>
          <Image source={cart} style={styles.cartViewImage} />
          <Phrase txt={cartCount} txtStyle={styles.cartViewNumber} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: { ...FONTS.rocherSmallTitle, color: COLORS.primary },
  cartView: {
    width: 50,
    height: 30,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.padding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.base,
  },
  cartViewImage: { width: 15, height: 15, resizeMode: 'contain' },
  cartViewNumber: { ...FONTS.body3_bold, color: COLORS.white },
});
export default CartBar;
