import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {Phrase, Heading, Spacer, CartConfirmItem, Hr} from '@components';
import globalStyles from '@constants/global-styles';
import {styles} from '../styles';
import {edit, balloons, mouse, card, cod} from '@constants/icons';
import {COLORS} from '@constants/theme';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

const StepFive = ({items, step, stepChanger}) => {
  const {t} = useTranslation();
  const global = useSelector(state => state.global);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 100}}>
      {/* Cart Widget */}
      <View style={globalStyles.whiteBg}>
        <View style={globalStyles.rowView}>
          <Heading txt={'Cart'} txtStyle={styles.cartHeading} />
          <TouchableOpacity
            style={[globalStyles.rowView]}
            onPress={() => {
              stepChanger(1);
            }}>
            <Image source={edit} style={styles.editImg} />
            <Phrase txt={'Edit'} txtStyle={styles.editTxt} />
          </TouchableOpacity>
        </View>

        {items.map((elem, index) => {
          return (
            <React.Fragment key={index.toString()}>
              <Spacer />
              <CartConfirmItem
                item={elem}
                onPress={() => {
                  stepChanger(2);
                }}
              />
              <Hr />
            </React.Fragment>
          );
        })}
      </View>
      {/* Cart Widget */}
      <Spacer />
      {/* Payment Widget */}
      <View style={globalStyles.whiteBg}>
        <View style={globalStyles.rowView}>
          <Heading txt={t('paymentMethod')} txtStyle={styles.cartHeading} />
          <TouchableOpacity
            style={[globalStyles.rowView]}
            onPress={() => {
              stepChanger(4);
            }}>
            <Image source={edit} style={styles.editImg} />
            <Phrase txt={t('edit')} txtStyle={styles.editTxt} />
          </TouchableOpacity>
        </View>
        <Spacer />
        <View style={[styles.methodContainer, {borderWidth: 0}]}>
          <View style={styles.leftView}>
            <Image source={cod} style={styles.methodImg} />
          </View>
          <View style={styles.midView}>
            <Phrase txt={t('cashOnDelivery')} txtStyle={styles.methodTitle} />
          </View>
        </View>
      </View>
      {/* Payment Widget */}

      <Spacer />

      {/* Billing Widget */}
      <View style={globalStyles.whiteBg}>
        <View style={globalStyles.rowView}>
          <Heading txt={t('billingAddress')} txtStyle={styles.cartHeading} />
          <TouchableOpacity
            style={[globalStyles.rowView]}
            onPress={() => {
              stepChanger(3);
            }}>
            <Image source={edit} style={styles.editImg} />
            <Phrase txt={t('edit')} txtStyle={styles.editTxt} />
          </TouchableOpacity>
        </View>
        <Spacer />
        <View>
          <View style={globalStyles.row}>
            <Phrase txt={`${t('home')}: `} txtStyle={styles.addressNameTitle} />
          </View>

          <Phrase
            txt={`${global.cart_billing_address?.first_name} ${global.cart_billing_address?.last_name}, ${global.cart_billing_address?.street}, ${global.cart_billing_address?.city}, ${global.cart_billing_address?.state}`}
            txtStyle={styles.addressName}
          />
          <Phrase
            txt={`${global.cart_billing_address?.mobile_number}`}
            txtStyle={styles.addressName}
          />
        </View>
      </View>
      {/* Billing Widget */}
      <Spacer />
      {/* Shipping Widget */}
      <View style={globalStyles.whiteBg}>
        <View style={globalStyles.rowView}>
          <Heading txt={t('shippingAddress')} txtStyle={styles.cartHeading} />
          <TouchableOpacity
            style={[globalStyles.rowView]}
            onPress={() => {
              stepChanger(3);
            }}>
            <Image source={edit} style={styles.editImg} />
            <Phrase txt={t('edit')} txtStyle={styles.editTxt} />
          </TouchableOpacity>
        </View>
        <Spacer />
        <View>
          <View style={globalStyles.row}>
            <Phrase txt={`${t('home')}: `} txtStyle={styles.addressNameTitle} />
          </View>

          <Phrase
            txt={`${global.cart_shipping_address?.first_name} ${global.cart_shipping_address?.last_name}, ${global.cart_shipping_address?.street}, ${global.cart_shipping_address?.city}, ${global.cart_shipping_address?.state}`}
            txtStyle={styles.addressName}
          />
          <Phrase
            txt={`${global.cart_shipping_address?.mobile_number}`}
            txtStyle={styles.addressName}
          />
        </View>
      </View>
      {/* Shipping Widget */}
      <Spacer />
      {/* Date Time Widget */}
      <View style={globalStyles.whiteBg}>
        <View style={globalStyles.rowView}>
          <Heading txt={t('deliveryDateTime')} txtStyle={styles.cartHeading} />
          <TouchableOpacity
            style={[globalStyles.rowView]}
            onPress={() => {
              stepChanger(3);
            }}>
            <Image source={edit} style={styles.editImg} />
            <Phrase txt={t('edit')} txtStyle={styles.editTxt} />
          </TouchableOpacity>
        </View>
        <Spacer />
        <View style={[globalStyles.rowView, {justifyContent: 'flex-start'}]}>
          <Phrase txt={`${t('date')}: `} txtStyle={styles.labelTxt} />
          <Phrase
            txt={`${global.cart_delivery_date}`}
            txtStyle={styles.valueTxt}
          />
        </View>
        <Spacer />
        <View style={[globalStyles.rowView, {justifyContent: 'flex-start'}]}>
          <Phrase txt={`${t('timeSlot')}: `} txtStyle={styles.labelTxt} />
          <Phrase
            txt={`${global.cart_delivery_time.value}`}
            txtStyle={styles.valueTxt}
          />
        </View>
      </View>
      {/* DateTime Widget */}
      <Spacer />
      {/* Special Widget */}
      {global.cart_character?.full_image ? (
        <View style={globalStyles.whiteBg}>
          <View style={globalStyles.rowView}>
            <Heading txt={t('specialDelivery')} txtStyle={styles.cartHeading} />
            <TouchableOpacity
              style={[globalStyles.rowView]}
              onPress={() => {
                stepChanger(3);
              }}>
              <Image source={edit} style={styles.editImg} />
              <Phrase txt={t('edit')} txtStyle={styles.editTxt} />
            </TouchableOpacity>
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
              source={{uri: global.cart_character.full_image}}
              style={styles.characterImg}
            />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Special Widget */}

      <Spacer />

      {/* Balloon Widget */}
      {global.cart_ballons_count > 0 ? (
        <View style={globalStyles.whiteBg}>
          <View style={globalStyles.rowView}>
            <Heading txt={t('balloons')} txtStyle={styles.cartHeading} />
            <TouchableOpacity
              style={[globalStyles.rowView]}
              onPress={() => {
                stepChanger(3);
              }}>
              <Image source={edit} style={styles.editImg} />
              <Phrase txt={t('edit')} txtStyle={styles.editTxt} />
            </TouchableOpacity>
          </View>
          <Spacer />
          <View style={[globalStyles.rowView, {justifyContent: 'flex-start'}]}>
            <Image source={balloons} style={styles.balloons} />
            <Phrase
              txt={`Qty: ${global.cart_ballons_count}`}
              txtStyle={styles.qty}
            />
          </View>
        </View>
      ) : null}

      {/* Balloon Widget */}
    </ScrollView>
  );
};

export default StepFive;
