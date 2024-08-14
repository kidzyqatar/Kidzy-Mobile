import {StyleSheet, Image, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
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
import {COLORS, SIZES, FONTS} from '@constants/theme';
import globalStyles from '@constants/global-styles';
import {edit} from '@constants/icons';
import {useTranslation} from 'react-i18next';

const CartConfirmItem = ({item, onPress = () => {}}) => {
  const {t} = useTranslation();
  return (
    <View>
      <View style={[globalStyles.rowView, styles.tileHeight]}>
        <View style={styles.leftView}>
          <View style={styles.imgView}>
            <Image
              source={{uri: item?.product?.full_image}}
              style={styles.img}
            />
          </View>
        </View>
        <View style={styles.rightView}>
          <View style={styles.innerRightView}>
            <Phrase
              txt={`${item?.product?.name}`}
              txtStyle={styles.itemTitle}
            />
            <Phrase
              txt={`QAR ${item?.product?.price}`}
              txtStyle={styles.itemPrice}
            />
          </View>
        </View>
      </View>
      <Spacer />

      {item.details?.wrapper_id == null ? null : (
        <TouchableOpacity style={globalStyles.row} onPress={onPress}>
          <Phrase txt={t(`giftWrapper`)} txtStyle={styles.infoTxt} />
          <Chip
            status={t('added')}
            bgColor={COLORS.success + '1A'}
            txtColor={COLORS.success}
            customStyle={{height: 30}}
            icon={edit}
          />
        </TouchableOpacity>
      )}

      <Spacer />
      {item.details?.full_image == null ? null : (
        <TouchableOpacity style={globalStyles.row} onPress={onPress}>
          <Phrase txt={t(`customImage`)} txtStyle={styles.infoTxt} />
          <Chip
            status={t('added')}
            bgColor={COLORS.success + '1A'}
            txtColor={COLORS.success}
            customStyle={{height: 30}}
            icon={edit}
          />
        </TouchableOpacity>
      )}
      <Spacer />
      {item.details?.gift_card == null ? null : (
        <TouchableOpacity style={globalStyles.row} onPress={onPress}>
          <Phrase txt={t(`giftCard`)} txtStyle={styles.infoTxt} />
          <Chip
            status={t('added')}
            bgColor={COLORS.success + '1A'}
            txtColor={COLORS.success}
            customStyle={{height: 30}}
            icon={edit}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CartConfirmItem;

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
  tileHeight: {height: 80},
  leftView: {width: SIZES.thirty, height: 80},
  img: {width: 80, height: 80, resizeMode: 'cover'},
  rightView: {
    width: SIZES.seventy,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innerRightView: {justifyContent: 'center'},
  binImage: {width: 15, height: 15, resizeMode: 'contain'},
  itemTitle: {...FONTS.body5, color: COLORS.black},
  itemPrice: {...FONTS.body4_bold, color: COLORS.black},
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
  calcImg: {width: 15, height: 15, resizeMode: 'contain'},
  calcTxt: {...FONTS.body3},
  infoTxt: {
    ...FONTS.body4_medium,
    color: COLORS.black,
    marginRight: SIZES.radius,
  },
});
