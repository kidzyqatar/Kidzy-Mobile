import { StyleSheet, Image, View, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import {
  MasterLayout,
  BackBar,
  Phrase,
  Spacer,
  Hr,
  MyButton,
  OrderItem,
  Chip,
} from '@components';
import { COLORS, SIZES, FONTS } from '@constants/theme';
import globalStyles from '@constants/global-styles';
import { bin, plus, minus } from '@constants/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setCart, setLoader } from '../../store/reducers/global';
import config from '../../constants/config';
import { callNonTokenApi } from '../../helpers/ApiRequest';

const CartItem = ({ item }) => {

  const global = useSelector(state => state.global);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.quantity);

  const deleteItemFromCart = () => {
    dispatch(setLoader(true));
    callNonTokenApi(
      `${config.apiName.deleteItemFromCart}`,
      'POST', {
      'id': item.id,
    }
    )
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {

          getCart()
        } else {
          Alert.alert('Error!', res.message)
        }

      })
      .catch(error => {
        dispatch(setLoader(false));
        console.log(error)
        setApiFailModal(true);
      });
  }

  const getCart = () => {
    dispatch(setLoader(true));
    callNonTokenApi(`${config.apiName.getCart}/${global.cart_session_id}`,
      'GET'
    )
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
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
  }

  const addItemTocart = async (quantity) => {
    console.log(quantity)
    dispatch(setLoader(true));
    callNonTokenApi(
      `${config.apiName.addToCart}`,
      'POST', {
      'product_id': item.product_id,
      'guest_session_id': global.cart_session_id,
      'quantity': quantity
    }
    )
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          getCart()
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

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
    addItemTocart(quantity + 1)
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      addItemTocart(quantity - 1)
    }
    if (quantity - 1 === 0) {
      deleteItemFromCart()
    }
  };
  return (
    <View style={[globalStyles.rowView, styles.tileHeight]}>
      <View style={styles.leftView}>
        <View style={styles.imgView}>
          <Image source={{ uri: item?.product.full_image }} style={styles.img} />
        </View>
      </View>
      <View style={styles.rightView}>
        <View>
          <Phrase txt={`${item.product.name}`} txtStyle={styles.itemTitle} numberOfLines={2} />
          <Phrase txt={`QAR ${item.product.price}`} txtStyle={styles.itemPrice} />
          <View style={styles.calcView}>
            <TouchableOpacity
              onPress={() => {
                decrementQuantity();
              }}>
              <Image source={minus} style={styles.calcImg} />
            </TouchableOpacity>
            <Phrase txt={quantity} txtStyle={styles.calcTxt} />
            <TouchableOpacity
              onPress={() => {
                incrementQuantity();
              }}>
              <Image source={plus} style={styles.calcImg} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={deleteItemFromCart}>
          <Image source={bin} style={styles.binImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  imgView: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileHeight: { height: 100 },
  leftView: { width: SIZES.thirty, height: 80 },
  img: { width: 80, height: 80, resizeMode: 'cover' },
  rightView: {
    width: SIZES.seventy,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  binImage: { width: 15, height: 15, resizeMode: 'contain' },
  itemTitle: { ...FONTS.body5, color: COLORS.black },
  itemPrice: { ...FONTS.body4_bold, color: COLORS.black },
  calcView: {
    width: SIZES.seventy,
    backgroundColor: COLORS.white,
    height: 35,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: SIZES.minor,
  },
  calcImg: { width: 15, height: 15, resizeMode: 'contain' },
  calcTxt: { ...FONTS.body3 },
});
