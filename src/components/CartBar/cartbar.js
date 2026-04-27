import React, {useEffect, useState} from 'react';
import {Image, Text, View, StyleSheet, Alert} from 'react-native';
import {FONTS, COLORS, SIZES} from '@constants/theme';
import {Heading, Phrase, MasterLayout} from '@components';
import {back, cart} from '@constants/icons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import * as RootNavigation from '@navigators/RootNavigation';

const CartBar = ({title, showCart = true, showBack = true}) => {
  const global = useSelector(state => state.global);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Calculate total quantity instead of just counting items
    const totalQuantity = global.cart?.order_items?.reduce((total, item) => {
      return total + (item.quantity || 0);
    }, 0) ?? 0;
    setCartCount(totalQuantity);
  }, [global.cart?.order_items]);

  return (
    <View style={styles.mainView}>
      <View style={styles.leftView}>
        {showBack && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => RootNavigation.back()}>
            <Image source={back} style={styles.backImg} />
          </TouchableOpacity>
        )}
        <Heading txt={title} txtStyle={styles.heading} />
      </View>
      {showCart && (
        <TouchableOpacity
          style={styles.cartView}
          onPress={() => {
            if (cartCount > 0) {
              RootNavigation.navigate('MyCart');
            } else {
              Alert.alert('Empty cart', 'Please add items to your cart');
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
  leftView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base,
  },
  backImg: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: COLORS.primary,
  },
  heading: {...FONTS.rocherSmallTitle, color: COLORS.primary},
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
  cartViewImage: {width: 15, height: 15, resizeMode: 'contain'},
  cartViewNumber: {...FONTS.body3_bold, color: COLORS.white},
});
export default CartBar;
