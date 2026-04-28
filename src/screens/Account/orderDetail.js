import React from 'react';
import {View, TouchableOpacity, Image, ScrollView} from 'react-native';
import {
  MasterLayout,
  BackBar,
  Phrase,
  Spacer,
  Hr,
  Chip,
  OrderItemVisual,
} from '@components';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import globalStyles from '@constants/global-styles';
import {styles} from './styles';
import {balloons} from '@constants/icons';
import {useTranslation} from 'react-i18next';
import {formatDateTime} from '../../helpers/formatDateTime';

function formatMoney(v) {
  const n = parseFloat(String(v ?? '').replace(/,/g, ''));
  return Number.isFinite(n) ? n.toFixed(2) : '0.00';
}

function pickSpecialDeliveryCost(item) {
  const raw =
    item?.special_delivery_cost ??
    item?.special_delivery_price ??
    item?.special_delivery ??
    0;
  return formatMoney(raw);
}

function resolveDiscount(item) {
  const raw =
    item?.discount ??
    item?.discount_amount ??
    item?.total_discount ??
    0;
  return formatMoney(raw);
}

function resolveShipping(item) {
  const raw =
    item?.shipping_cost ?? item?.shipping_charges ?? item?.estimated_shipping ?? 0;
  return formatMoney(raw);
}

/** API returns uppercase (PENDING); chip colors previously only matched Title Case. */
function statusForChipColors(status) {
  return String(status ?? '').toUpperCase();
}

function statusDisplayLabel(status) {
  const u = String(status ?? '').toUpperCase();
  const map = {
    PENDING: 'Pending',
    CART: 'Cart',
    PROCESSING: 'Processing',
    COMPLETED: 'Complete',
    COMPLETE: 'Complete',
    CANCELLED: 'Cancelled',
    CANCELED: 'Cancelled',
  };
  return map[u] ?? status ?? '';
}

const OrderDetail = ({route}) => {
  const {t} = useTranslation();
  const {item} = route.params;

  const statusU = statusForChipColors(item?.status);
  let chipBgColor = COLORS.grayLight + '1A';
  let chipTxtColor = COLORS.gray;
  switch (statusU) {
    case 'PENDING':
    case 'CART':
      chipBgColor = COLORS.danger + '1A';
      chipTxtColor = COLORS.danger;
      break;
    case 'PROCESSING':
      chipBgColor = COLORS.info + '1A';
      chipTxtColor = COLORS.info;
      break;
    case 'COMPLETED':
    case 'COMPLETE':
      chipBgColor = COLORS.success + '1A';
      chipTxtColor = COLORS.success;
      break;
    default:
      break;
  }

  const placedAt =
    item?.created_at ?? item?.createdAt ?? item?.updated_at ?? null;
  const paidAt =
    item?.paid_at ??
    item?.paidAt ??
    item?.payment_completed_at ??
    item?.paid_on ??
    null;

  const specialDeliveryAmount = pickSpecialDeliveryCost(item);
  const balloonAmount = formatMoney(item?.balloon_cost);

  return (
    <MasterLayout
      bgColor={COLORS.bgGray}
      scrolling={false}
      max={true}
      statusBarColor={COLORS.white}
      statusBarStyle="dark-content">
      <View style={globalStyles.whiteBg}>
        <BackBar title={t('orderDetails')} navigateTo={'Orders'} />
      </View>
      <Spacer />
      <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
        <View style={{...globalStyles.whiteBg, paddingBottom: 0}}>
          <View style={{...globalStyles.rowView}}>
            <Phrase txt={t('orderStatus')} txtStyle={styles.smallHeading} />
            <Chip
              status={statusDisplayLabel(item?.status)}
              bgColor={chipBgColor}
              txtColor={chipTxtColor}
            />
          </View>
          <View
            style={{borderWidth: 0.5, borderColor: 'black', marginVertical: 10}}
          />
        </View>

        <View style={{...globalStyles.whiteBg}}>
          <Phrase txt={t('orderInfo')} txtStyle={styles.smallHeading} />
          <Phrase
            txt={`${t('orderId')}: ${item.id}`}
            txtStyle={styles.smallInfoTxt}
          />
          <Phrase
            txt={`${t('placedOn')}: ${placedAt ? formatDateTime(placedAt) : '—'}`}
            txtStyle={styles.smallInfoTxt}
          />
          {paidAt ? (
            <Phrase
              txt={`${t('paidOn')}: ${formatDateTime(paidAt)}`}
              txtStyle={styles.smallInfoTxt}
            />
          ) : statusU !== 'PENDING' && statusU !== 'CART' ? (
            <Phrase
              txt={`${t('paidOn')}: ${formatDateTime(item.updated_at)}`}
              txtStyle={styles.smallInfoTxt}
            />
          ) : null}
        </View>

        <Spacer />
        <View style={globalStyles.whiteBg}>
          <Phrase txt={t('items')} txtStyle={styles.smallHeading} />

          {item?.order_items?.map((elem, index) => {
            return (
              <React.Fragment key={index.toString()}>
                <Spacer />
                <OrderItemVisual item={elem} />
                <Hr />
              </React.Fragment>
            );
          })}
        </View>
        <Spacer />

        {item.character?.full_image ? (
          <View style={globalStyles.whiteBg}>
            <View style={globalStyles.rowView}>
              <Phrase
                txt={t('specialDelivery')}
                txtStyle={styles.smallHeading}
              />
              <Phrase
                txt={`QAR ${specialDeliveryAmount}`}
                txtStyle={styles.totalTxt}
              />
            </View>
            <Spacer />
            <TouchableOpacity
              style={[
                styles.character,
                {
                  borderWidth: 3,
                  borderColor: COLORS.secondary,
                },
              ]}>
              <Image
                source={{uri: item.character.full_image}}
                style={styles.characterImg}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        {parseFloat(balloonAmount) > 0 ? (
          <View style={globalStyles.whiteBg}>
            <View style={globalStyles.rowView}>
              <Phrase txt={t('balloons')} txtStyle={styles.smallHeading} />
            </View>
            <Spacer />
            <View
              style={[globalStyles.rowView, {justifyContent: 'flex-start'}]}>
              <Image source={balloons} style={styles.balloons} />
              <Phrase txt={`QAR ${balloonAmount}`} txtStyle={styles.qty} />
            </View>
          </View>
        ) : null}

        <View style={globalStyles.whiteBg}>
          <View style={globalStyles.rowView}>
            <Phrase txt={t('total')} txtStyle={styles.smallInfoTxt} />
            <Phrase
              txt={`QAR ${formatMoney(item.grand_total)}`}
              txtStyle={styles.totalTxt}
            />
          </View>
          <Hr />
          <Spacer />
          <View style={styles.moreInfo}>
            <View style={[globalStyles.rowView, styles.smallGap]}>
              <Phrase txt={t('cartSubtotal')} txtStyle={styles.smallInfoTxt} />
              <Phrase
                txt={`QAR ${formatMoney(item.subtotal)}`}
                txtStyle={styles.totalTxt}
              />
            </View>
            <Hr type={'small'} />
            <View style={[globalStyles.rowView, styles.smallGap]}>
              <Phrase txt={t('giftWrapper')} txtStyle={styles.smallInfoTxt} />
              <Phrase
                txt={`QAR ${formatMoney(item.wrapper_cost)}`}
                txtStyle={styles.totalTxt}
              />
            </View>
            <Hr type={'small'} />
            <View style={[globalStyles.rowView, styles.smallGap]}>
              <Phrase
                txt={t('specialDelivery')}
                txtStyle={styles.smallInfoTxt}
              />
              <Phrase txt={`QAR ${specialDeliveryAmount}`} txtStyle={styles.totalTxt} />
            </View>
            <Hr type={'small'} />
            <View style={[globalStyles.rowView, styles.smallGap]}>
              <Phrase txt={t('balloons')} txtStyle={styles.smallInfoTxt} />
              <Phrase txt={`QAR ${balloonAmount}`} txtStyle={styles.totalTxt} />
            </View>
            <Hr type={'small'} />
            <View style={[globalStyles.rowView, styles.smallGap]}>
              <Phrase txt={t('tax')} txtStyle={styles.smallInfoTxt} />
              <Phrase txt={`QAR ${formatMoney(item.tax)}`} txtStyle={styles.totalTxt} />
            </View>
            <Hr type={'small'} />
            <View style={[globalStyles.rowView, styles.smallGap]}>
              <Phrase
                txt={t('estimatedShipping')}
                txtStyle={styles.smallInfoTxt}
              />
              <Phrase
                txt={`QAR ${resolveShipping(item)}`}
                txtStyle={styles.totalTxt}
              />
            </View>
            <Hr type={'small'} />
            <View style={[globalStyles.rowView, styles.smallGap]}>
              <Phrase txt={t('discount')} txtStyle={styles.smallInfoTxt} />
              <Phrase txt={`QAR ${resolveDiscount(item)}`} txtStyle={styles.totalTxt} />
            </View>
          </View>
        </View>
        <Spacer />
      </ScrollView>
    </MasterLayout>
  );
};

export default OrderDetail;
