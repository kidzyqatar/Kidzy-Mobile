import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import {btnCart} from '@constants/icons';
import {Phrase, MyButton} from '@components';
import * as RootNavigation from '@navigators/RootNavigation';
import {callNonTokenApi} from '../../helpers/ApiRequest';
import config from '../../constants/config';
import {useDispatch, useSelector} from 'react-redux';
import {setCart, setLoader} from '../../store/reducers/global';
import {useTranslation} from 'react-i18next';

const ProductWidget = ({item}) => {
  const {t} = useTranslation();
  const {width: screenWidth} = useWindowDimensions();
  const global = useSelector(state => state.global);
  const dispatch = useDispatch();

  const addItemTocart = async () => {
    dispatch(setLoader(true));
    const oldQuantity = global?.cart?.order_items?.find(
      x => x.product_id === item.id,
    )?.quantity;
    callNonTokenApi(`${config.apiName.addToCart}`, 'POST', {
      product_id: item.id,
      guest_session_id: global.cart_session_id,
      quantity: oldQuantity ? oldQuantity + 1 : 1,
    })
      .then(res => {
        if (res.status == 200) {
          dispatch(setCart(res.data));
          callNonTokenApi(
            `${config.apiName.getCart}/${global.cart_session_id}`,
            'GET',
          )
            .then(res => {
              if (res.status == 200) {
                dispatch(setLoader(false));
                console.log(res.data.cart.order_items.length);
                console.log('res.data.cart', res.data.cart);
                dispatch(setCart(res.data.cart));
              } else {
                Alert.alert('Error!', res.message);
              }
            })
            .catch(error => {
              dispatch(setLoader(false));
              console.log(error);
              setApiFailModal(true);
            });
        } else {
          Alert.alert('Error!', res.message);
        }
      })
      .catch(error => {
        dispatch(setLoader(false));
        console.log(error);
        setApiFailModal(true);
      });
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.container,
          {width: screenWidth * 0.5 - SIZES.radius * 3},
        ]}
        onPress={() => {
          RootNavigation.navigate('ProductDetail', {item: item});
        }}>
        <Image source={{uri: item.full_image}} style={styles.productImg} />
        <View style={{padding: SIZES.radius}}>
          <Phrase
            txt={item.name}
            txtStyle={styles.productTitle}
            numberOfLines={3}
          />
          {item.before_discount_price && (
            <Phrase
              txt={`QAR ${item.before_discount_price}`}
              txtStyle={styles.productOldPrice}
              crossed
            />
          )}
          <Phrase txt={`QAR ${item.price}`} txtStyle={styles.productPrice} />
          <MyButton
            label={<Text style={styles.productBtn}>{t('addToCart')}</Text>}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    borderColor: COLORS.grayLight,
    borderRadius: SIZES.base,
    marginRight: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    marginVertical: SIZES.radius,
  },
  productImg: {
    width: '100%',
    height: 192,
    resizeMode: 'contain',
  },
  productTitle: {
    color: COLORS.black,
    ...FONTS.body5,
    height: 16 * 4,
  },
  productPrice: {
    color: COLORS.black,
    marginTop: SIZES.base,
    ...FONTS.body3_bold,
  },
  productOldPrice: {
    color: COLORS.gray,
    marginTop: SIZES.base,
    ...FONTS.body3_bold,
    textDecorationLine: 'line-through',
  },
  productBtn: {
    ...FONTS.body5_bold,
  },
  btnStyle: {
    borderWidth: 0,
    height: 40,
  },
});

export default ProductWidget;
