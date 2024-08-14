import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Phrase, Chip} from '@components';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import * as RootNavigation from '@navigators/RootNavigation';
import {useTranslation} from 'react-i18next';

const OrderItem = ({item}) => {
  const {t} = useTranslation();
  let chipBgColor = '';
  let chipTxtColor = '';
  switch (item.status) {
    case 'Pending':
      chipBgColor = COLORS.danger + '1A';
      chipTxtColor = COLORS.danger;
      break;
    case 'Processing':
      chipBgColor = COLORS.info + '1A';
      chipTxtColor = COLORS.info;
      break;
    case 'Complete':
      chipBgColor = COLORS.success + '1A';
      chipTxtColor = COLORS.success;
      break;

    default:
      break;
  }
  return (
    <View style={styles.orderItemView}>
      <View style={styles.orderItemTopRow}>
        <View style={styles.orderItemLeftCol}>
          <Phrase
            txt={item.title}
            txtStyle={styles.orderItemTitle}
            numberOfLines={1}
          />
          <Phrase
            txt={`${t('orderId')}: ${item.id}`}
            txtStyle={styles.orderItemId}
            numberOfLines={1}
          />
        </View>
        <View style={styles.orderItemRightCol}>
          <Chip
            status={item.status}
            bgColor={chipBgColor}
            txtColor={chipTxtColor}
          />
        </View>
      </View>
      <View style={styles.orderItemTopRow}>
        <View style={styles.orderItemLeftCol}>
          <Phrase
            txt={`QAR ${item.grand_total}`}
            txtStyle={styles.orderItemPrice}
            numberOfLines={1}
          />
        </View>
        <View style={styles.orderItemRightCol}>
          <TouchableOpacity
            onPress={() => {
              RootNavigation.navigate('OrderDetail', {item: item});
            }}>
            <Phrase
              txt={t('viewDetails')}
              txtStyle={styles.orderDetailLinkTxt}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  orderItemView: {
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: SIZES.base,
    padding: SIZES.radius,
  },
  orderItemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderItemLeftCol: {width: SIZES.sixty},
  orderItemTitle: {...FONTS.body5_medium, color: COLORS.black},
  orderItemId: {...FONTS.body5, color: COLORS.black},
  orderItemPrice: {...FONTS.body5_bold, color: COLORS.black},
  orderItemRightCol: {width: SIZES.fourty, alignItems: 'flex-end'},
  orderDetailLinkTxt: {
    color: COLORS.secondary,
    ...FONTS.body4_bold,
  },
});
