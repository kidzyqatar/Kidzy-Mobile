import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import React, { useState } from 'react';
import { List } from 'react-native-paper';
import { discount, chevron, bin } from '@constants/icons';
import { COLORS, SIZES, FONTS } from '@constants/theme';
import { MyButton, Input, Phrase, Chip } from '@components';
import config from '../../constants/config';
import { callNonTokenApi } from '../../helpers/ApiRequest';
const DiscountWidget = ({ coupon, calculations, calculationsChanger, applyCoupon, removeCoupon }) => {
  const [couponText, setCouponText] = useState(null)
  return (
    <List.Section title="" style={styles.discountContainer}>
      <List.Accordion
        title={coupon != null ? 'Coupon Added' : 'Have a coupon?'}
        titleStyle={styles.couponTitle}
        style={styles.accordian}
        left={props => <Image source={discount} style={styles.discountImg} />}
        right={props =>
          props.isExpanded === false ? (
            <Image source={chevron} style={styles.chevronCloseImg} />
          ) : (
            <Image source={chevron} style={styles.chevronOpenImg} />
          )
        }>
        <View style={styles.accordianContent}>
          {coupon != null ? (
            <>
              <View
                style={[
                  styles.accordianContentLeftNormal,
                  styles.accordianContentLeftRow,
                ]}>
                <Phrase txt={coupon.name} txtStyle={styles.couponCode} />
                <Chip
                  status={`${coupon.percentage}%`}
                  txtColor={COLORS.primary}
                  bgColor={COLORS.primary + '1A'}
                  customStyle={styles.couponChipStyle}
                />
              </View>
              <Pressable
                style={styles.accordianContentRightNormal}
                onPress={removeCoupon}>
                <Image source={bin} style={styles.binImage} />
              </Pressable>
            </>
          ) : (
            <>
              <View style={[styles.accordianContentLeft]}>
                <Input
                  placeholder={'Enter your coupon'}
                  isSecure={false}
                  // value={}
                  setValue={setCouponText}

                />
              </View>
              <View style={styles.accordianContentRight}>
                <MyButton
                  label={'Apply'}
                  txtColor={COLORS.secondaryUltra}
                  btnColor={COLORS.secondaryLite}
                  borderColor={COLORS.secondaryLight}
                  onPress={() => {
                    //calculationsChanger({ ...calculations, discount: 70 });
                    applyCoupon(couponText)
                  }}
                />
              </View>
            </>
          )}
        </View>
      </List.Accordion>
    </List.Section>
  );
};

export default DiscountWidget;

const styles = StyleSheet.create({
  discountContainer: {
    backgroundColor: 'white',
    paddingHorizontal: SIZES.radius,
  },
  couponTitle: { ...FONTS.body4_medium, color: COLORS.black },
  accordian: {
    backgroundColor: COLORS.white,
  },
  discountImg: {
    height: SIZES.hundred,
    width: 20,
    resizeMode: 'contain',
  },
  chevronCloseImg: {
    width: 12,
    resizeMode: 'contain',
  },
  chevronOpenImg: {
    width: 12,
    resizeMode: 'contain',
    transform: [{ rotate: '180deg' }],
  },
  accordianContent: {
    width: SIZES.hundred,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.radius,
  },
  accordianContentLeft: {
    width: SIZES.eighty,
    position: 'absolute',
  },
  accordianContentLeftNormal: {
    width: SIZES.eighty,
    justifyContent: 'flex-start',
    marginLeft: -SIZES.padding,
  },
  accordianContentLeftRow: {
    flexDirection: 'row',
  },
  accordianContentRight: {
    width: SIZES.thirty,
    position: 'absolute',
    right: 0,
    top: -10,
  },
  accordianContentRightNormal: {
    width: SIZES.twenty,
    alignItems: 'flex-end',
  },
  couponCode: { color: COLORS.primary, ...FONTS.body2_medium },
  couponChipStyle: {
    width: SIZES.twentyFive,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginLeft: SIZES.radius,
  },
  binImage: { width: 15, height: 15, resizeMode: 'contain' },
});
