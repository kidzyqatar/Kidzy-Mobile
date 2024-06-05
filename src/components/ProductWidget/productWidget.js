import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { COLORS, SIZES, FONTS } from '@constants/theme';
import { btnCart } from '@constants/icons';
import { Phrase, MyButton } from '@components';
import * as RootNavigation from '@navigators/RootNavigation';
import { callNonTokenApi } from '../../helpers/ApiRequest';
import config from '../../constants/config';
import { useDispatch, useSelector } from 'react-redux';
import { setCart, setLoader } from '../../store/reducers/global';



const ProductWidget = ({ item }) => {
  const global = useSelector(state => state.global);
  const dispatch = useDispatch();

  const addItemTocart = async () => {
    dispatch(setLoader(true));
    callNonTokenApi(
      `${config.apiName.addToCart}`,
      'POST', {
      'product_id': item.id,
      'guest_session_id': global.cart_session_id,
      'quantity': 1
    }
    )
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          dispatch(setCart(res.data))
          callNonTokenApi(`${config.apiName.getCart}/${global.cart_session_id}`,
            'GET'
          )
            .then(res => {
              if (res.status == 200) {
                dispatch(setLoader(false));
                console.log(res.data.cart.order_items.length)
                dispatch(setCart(res.data.cart))
              } else {
                Alert.alert('Error!', res.message)
              }
            })
            .catch(error => {
              dispatch(setLoader(false));
              console.log(error)
              setApiFailModal(true);
            })
        } else {
          Alert.alert('Error!', res.message)
        }
      })
      .catch(error => {
        dispatch(setLoader(false));
        console.log(error)
        setApiFailModal(true);
      });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        RootNavigation.navigate('ProductDetail', { item: item });
      }}>
      <Image source={{ uri: item.full_image }} style={styles.productImg} />
      <View style={{ padding: SIZES.radius }}>
        <Phrase txt={item.name} txtStyle={styles.productTitle} numberOfLines={3} />
        <Phrase txt={`QAR ${item.price}`} txtStyle={styles.productPrice} />
        <MyButton
          label={<Text style={styles.productBtn}>Add to Cart</Text>}
          btnStyle={styles.btnStyle}
          txtColor={COLORS.secondary}
          btnColor={COLORS.cartBtn}
          borderColor={COLORS.black}
          icon={btnCart}
          iconPosition={'right'}
          onPress={addItemTocart}
        />
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 160,
    borderWidth: 0.5,
    borderColor: COLORS.grayLight,
    borderRadius: SIZES.base,
    marginRight: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    marginVertical: SIZES.radius,
  },
  productImg: { width: 160, height: 192, resizeMode: 'contain' },
  productTitle: { color: COLORS.black, ...FONTS.body5, height: 16 * 4, },
  productPrice: {
    color: COLORS.black,
    marginTop: SIZES.base,
    ...FONTS.body3_bold,
  },
  productBtn: { ...FONTS.body5_bold },
  btnStyle: { borderWidth: 0, height: 40 },
});

export default ProductWidget;
