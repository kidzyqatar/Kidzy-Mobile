import { StyleSheet, Image, View } from 'react-native';
import React from 'react';
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

const OrderItemVisual = ({ item }) => {
  return (
    <View style={[globalStyles.rowView, styles.tileHeight]}>
      <View style={styles.leftView}>
        <View style={styles.imgView}>
          <Image source={{ uri: item?.product?.full_image }} style={styles.img} />
        </View>
      </View>
      <View style={styles.rightView}>
        <Phrase txt={`${item?.product.name}`} txtStyle={styles.itemTitle} />
        <Phrase txt={`QAR ${item?.total_price}`} txtStyle={styles.itemPrice} />
        <Phrase txt={`Qty: ${item?.quantity}`} txtStyle={styles.orderItemItemQty} />
      </View>
    </View>
  );
};

export default OrderItemVisual;

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
  tileHeight: { height: 80 },
  leftView: { width: SIZES.thirty, height: 80 },
  img: { width: 80, height: 80, resizeMode: 'cover' },
  rightView: { width: SIZES.seventy, height: 80 },
  itemTitle: { ...FONTS.body5, color: COLORS.black },
  itemPrice: { ...FONTS.body4_bold, color: COLORS.black },
});
