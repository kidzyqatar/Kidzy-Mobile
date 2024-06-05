import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import globalStyles from '@constants/global-styles';
import { COLORS, FONTS, SIZES } from '@constants/theme';
import { Phrase, Hr, MyButton } from '@components';
import { chevron } from '@constants/icons';
import { useSelector } from 'react-redux';

const TotalWidget = ({ calculations }) => {
  const global = useSelector(state => state.global);
  return (
    <View>
      <View style={styles.container}>
        <View style={[globalStyles.rowView, styles.row]}>
          <Phrase txt={'Cart Subtotal'} txtStyle={styles.detailTxt} />
          <Phrase
            txt={`QAR ${calculations.subtotal}`}
            txtStyle={styles.priceTxt}
          />
        </View>
        <Hr type={'sm'} />
        <View style={[globalStyles.rowView, styles.row]}>
          <Phrase txt={'Gift Wrapper'} txtStyle={styles.detailTxt} />
          <Phrase
            txt={`QAR ${calculations.wrapper}`}
            txtStyle={styles.priceTxt}
          />
        </View>
        <Hr type={'sm'} />
        <View style={[globalStyles.rowView, styles.row]}>
          <Phrase txt={'Special Delivery'} txtStyle={styles.detailTxt} />
          <Phrase
            txt={`QAR ${calculations.specialDelivery}`}
            txtStyle={styles.priceTxt}
          />
        </View>
        <Hr type={'sm'} />
        <View style={[globalStyles.rowView, styles.row]}>
          <Phrase txt={'Balloons'} txtStyle={styles.detailTxt} />
          <Phrase
            txt={`QAR ${calculations.balloons}`}
            txtStyle={styles.priceTxt}
          />
        </View>
        <Hr type={'sm'} />
        <View style={[globalStyles.rowView, styles.row]}>
          <Phrase txt={'Estimated Shipping'} txtStyle={styles.detailTxt} />
          <Phrase
            txt={`QAR ${calculations.shipping}`}
            txtStyle={styles.priceTxt}
          />
        </View>
        <Hr type={'sm'} />
        {calculations.discount > 0 && (
          <>
            <View style={[globalStyles.rowView, styles.discountContainer]}>
              <View style={styles.discountWidget}>
                <Phrase txt={`Discount: ${global.cart.coupon.name}`} txtStyle={styles.detailTxt} />
                <Phrase txt={`-QAR ${calculations.discount}`} txtStyle={styles.priceTxt} />
              </View>
            </View>
            <Hr type={'sm'} />
          </>
        )}

        {/* Cart Trigger */}
        <View
          style={[globalStyles.whiteBg, styles.cartTriggerView]}
          onPress={() => refRBSheet.current.open()}>
          <View style={[styles.triggerLeft]}>
            <Phrase txt={'Total'} txtStyle={styles.totalTxt} />
            <Phrase
              txt={`QAR ${calculations.grandTotal}`}
              txtStyle={styles.priceTxt}
            />
            <Image source={chevron} style={styles.chevron} />
          </View>
          <View style={styles.triggerRight}>
            <MyButton
              label={'Cehckout'}
              txtColor={COLORS.white}
              btnColor={COLORS.primary}
              borderColor={COLORS.primary}
              btnStyle={styles.continueBtn}
            />
          </View>
        </View>
        {/* Cart Trigger */}
      </View>
    </View>
  );
};

export default TotalWidget;

const styles = StyleSheet.create({
  container: { paddingHorizontal: SIZES.padding },
  detailTxt: { color: COLORS.black, ...FONTS.body4_meduim },
  priceTxt: { color: COLORS.black, ...FONTS.body4_bold },
  row: { height: 40 },
  cartTriggerView: {
    flexDirection: 'row',
    width: SIZES.hundred,
    height: 60,
    alignItems: 'center',
    padding: 0,
  },
  triggerLeft: {
    width: SIZES.fifty,
    flexDirection: 'row',
  },
  totalTxt: {
    ...FONTS.body3,
    color: COLORS.black,
    marginRight: SIZES.base,
  },
  priceTxt: {
    ...FONTS.body3_bold,
    color: COLORS.black,
    marginRight: SIZES.radius,
  },
  chevron: { width: 12, resizeMode: 'contain' },
  triggerRight: {
    width: SIZES.fifty,
    height: 60,
  },
  continueBtn: { height: 40, width: SIZES.eighty, alignSelf: 'flex-end' },
  discountWidget: {
    backgroundColor: COLORS.primary + '1A',
    width: SIZES.hundred,
    paddingVertical: SIZES.radius,
    paddingHorizontal: SIZES.base,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  discountContainer: { paddingVertical: SIZES.radius },
});
