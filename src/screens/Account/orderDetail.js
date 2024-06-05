import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import {
  MasterLayout,
  BackBar,
  Phrase,
  Spacer,
  Hr,
  Chip,
  OrderItemVisual,
} from '@components';
import { COLORS, SIZES, FONTS } from '@constants/theme';
import globalStyles from '@constants/global-styles';
import { styles } from './styles';
import { balloons } from '@constants/icons';

const OrderDetail = ({ route }) => {
  const { item } = route.params;
  let chipBgColor = '';
  let chipTxtColor = '';
  switch (item?.status) {
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
    <MasterLayout bgColor={COLORS.bgGray} scrolling={false} max={true}>
      <View style={globalStyles.whiteBg}>
        <BackBar title={'Order Details'} navigateTo={'Orders'} />
      </View>
      <Spacer />
      <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
        <View style={globalStyles.whiteBg}>
          <View style={globalStyles.rowView}>
            <Phrase txt={'Order Status'} txtStyle={styles.smallHeading} />
            <Chip
              status={item?.status}
              bgColor={chipBgColor}
              txtColor={chipTxtColor}
            />
          </View>
        </View>
        <Spacer />

        <View style={globalStyles.whiteBg}>
          <Phrase txt={'Order Info'} txtStyle={styles.smallHeading} />
          <Phrase txt={`Order ID: ${item.id}`} txtStyle={styles.smallInfoTxt} />
          <Phrase
            txt={`Placed on: ${item.updated_at}`}
            txtStyle={styles.smallInfoTxt}
          />
          <Phrase
            txt={`Paid on: ${item.updated_at}`}
            txtStyle={styles.smallInfoTxt}
          />
        </View>

        <Spacer />
        <View style={globalStyles.whiteBg}>
          <Phrase txt={`Items`} txtStyle={styles.smallHeading} />

          {item?.order_items.map((elem, index) => {
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
        {/* Special Widget */}
        {(item.character?.full_image) ? <View style={globalStyles.whiteBg}>
          <View style={globalStyles.rowView}>
            <Phrase txt={'Special Delivery'} txtStyle={styles.smallHeading} />
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
            <Image source={{ uri: item.character.full_image }} style={styles.characterImg} />
          </TouchableOpacity>
        </View> : (null)}

        {/* Special Widget */}

        <Spacer />

        {/* Balloon Widget */}
        {item.balloon_cost > 0 ? <View style={globalStyles.whiteBg}>
          <View style={globalStyles.rowView}>
            <Phrase txt={'Balloons'} txtStyle={styles.smallHeading} />
          </View>
          <Spacer />
          <View style={[globalStyles.rowView, { justifyContent: 'flex-start' }]}>
            <Image source={balloons} style={styles.balloons} />
            <Phrase txt={`QAR: ${item.balloon_cost}`} txtStyle={styles.qty} />
          </View>
        </View> : (null)}
        <Spacer />
        <View style={globalStyles.whiteBg}>
          <View style={globalStyles.rowView}>
            <Phrase txt={'Total'} txtStyle={styles.smallInfoTxt} />
            <Phrase txt={`QAR ${item.grand_total}`} txtStyle={styles.totalTxt} />
          </View>
          <Hr />
          <Spacer />
          <View style={styles.moreInfo}>
            <View style={[globalStyles.rowView, styles.smallGap]}>
              <Phrase txt={'Cart Subtotal'} txtStyle={styles.smallInfoTxt} />
              <Phrase txt={`QAR ${item.subtotal}`} txtStyle={styles.totalTxt} />
            </View>
            <Hr type={'small'} />
            <View style={[globalStyles.rowView, styles.smallGap]}>
              <Phrase txt={'Gift Wrapper'} txtStyle={styles.smallInfoTxt} />
              <Phrase
                txt={`QAR ${item.wrapper_cost}`}
                txtStyle={styles.totalTxt}
              />
            </View>
            <Hr type={'small'} />
            <View style={[globalStyles.rowView, styles.smallGap]}>
              <Phrase txt={'Tax'} txtStyle={styles.smallInfoTxt} />
              <Phrase txt={`QAR ${item.tax}`} txtStyle={styles.totalTxt} />
            </View>
            <Hr type={'small'} />
            <View style={[globalStyles.rowView, styles.smallGap]}>
              <Phrase
                txt={'Estimated Shipping'}
                txtStyle={styles.smallInfoTxt}
              />
              <Phrase
                txt={`QAR ${item.shipping_cost}`}
                txtStyle={styles.totalTxt}
              />
            </View>
            <Hr type={'small'} />
            <View style={[globalStyles.rowView, styles.smallGap]}>
              <Phrase txt={'Discount'} txtStyle={styles.smallInfoTxt} />
              <Phrase txt={`QAR ${item.discount}`} txtStyle={styles.totalTxt} />
            </View>
          </View>
        </View>
        <Spacer />
      </ScrollView>
    </MasterLayout>
  );
};

export default OrderDetail;
