import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
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
import { styles } from './styles';
import { cod, card, tick } from '@constants/icons';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Heading, Input } from '@components';
import {
  checkedRadio,
  uncheckedRadio,
  checked as checkedCheckbox,
  unchecked as uncheckedCheckbox,
} from '@constants/icons';

const PaymentInformation = () => {
  const refRBSheet = useRef();
  const [defaultMethod, setDefaultMethod] = useState(1);
  const [checked, setChecked] = React.useState('card');
  const [saveCard, setSaveCard] = React.useState(false);

  const [cardNumber, setCardNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [bankName, setBankName] = useState('');
  return (
    <MasterLayout bgColor={COLORS.bgGray} scrolling={true} max={true}>
      <View style={globalStyles.whiteBg}>
        <BackBar title={'Payment Information'} navigateTo={'Account'} />
      </View>
      <Spacer />
      <View style={globalStyles.whiteBg}>
        <View
          style={[
            styles.methodContainer,
            {
              backgroundColor:
                defaultMethod == 1 ? COLORS.secondaryLite : COLORS.white,
            },
          ]}>
          <View style={styles.leftView}>
            <Image source={cod} style={styles.methodImg} />
          </View>
          <View style={styles.midView}>
            <Phrase txt={'Cash On Delivery'} txtStyle={styles.methodTitle} />
            <TouchableOpacity
              onPress={() => {
                if (defaultMethod !== 1) {
                  setDefaultMethod(1);
                }
              }}>
              <Phrase
                txt={defaultMethod == 1 ? 'Default' : 'Set as Default'}
                txtStyle={styles.methodDefaultTxt}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.rightView}>
            {defaultMethod == 1 && (
              <Image source={tick} style={styles.tickImage} />
            )}
          </View>
        </View>
        <Spacer />
        {/* <View
          style={[
            styles.methodContainer,
            {
              backgroundColor:
                defaultMethod == 2 ? COLORS.secondaryLite : COLORS.white,
            },
          ]}>
          <View style={styles.leftView}>
            <Image source={card} style={styles.methodImg} />
          </View>
          <View style={styles.midView}>
            <Phrase txt={'Visa'} txtStyle={styles.methodTitle} />
            <Phrase txt={'Expiry 06/2024'} txtStyle={styles.methodExpiry} />
            <TouchableOpacity
              onPress={() => {
                if (defaultMethod !== 2) {
                  setDefaultMethod(2);
                }
              }}>
              <Phrase
                txt={defaultMethod == 2 ? 'Default' : 'Set as Default'}
                txtStyle={styles.methodDefaultTxt}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.rightView}>
            {defaultMethod == 2 && (
              <Image source={tick} style={styles.tickImage} />
            )}
          </View>
        </View>
        <Spacer />
        <Spacer />
        <MyButton
          label={'Add New Method'}
          txtColor={COLORS.secondary}
          btnColor={COLORS.secondaryLite}
          borderColor={COLORS.secondaryLite}
          onPress={() => refRBSheet.current.open()}
        /> */}
      </View>

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={600}
        minClosingHeight={0}
        customStyles={{
          wrapper: {
            backgroundColor: COLORS.black,
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <View style={[globalStyles.contentContainer]}>
          <View style={styles.bSheetTop}>
            <Heading
              txt={'Add New Payment Method'}
              txtStyle={styles.bSheetTopHeading}
            />
            <Spacer />
            <View style={[globalStyles.rowView, globalStyles.spaceAround]}>
              <TouchableOpacity
                onPress={() => {
                  if (checked !== 'card') {
                    setChecked('card');
                  }
                }}
                style={[
                  styles.addPaymentMethodButton,
                  {
                    backgroundColor:
                      checked == 'card' ? COLORS.secondaryLite : COLORS.white,
                    borderColor:
                      checked == 'card'
                        ? COLORS.secondaryUltra
                        : COLORS.grayLight,
                  },
                ]}>
                <Image
                  source={checked == 'card' ? checkedRadio : uncheckedRadio}
                  style={styles.radioBtn}
                />
                <Phrase
                  txt={'Debit/Credit Card'}
                  txtStyle={styles.addPaymentMethodButtonTxt}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (checked !== 'bank') {
                    setChecked('bank');
                  }
                }}
                style={[
                  styles.addPaymentMethodButton,
                  {
                    backgroundColor:
                      checked == 'bank' ? COLORS.secondaryLite : COLORS.white,
                    borderColor:
                      checked == 'bank'
                        ? COLORS.secondaryUltra
                        : COLORS.grayLight,
                  },
                ]}>
                <Image
                  source={checked == 'bank' ? checkedRadio : uncheckedRadio}
                  style={styles.radioBtn}
                />
                <Phrase
                  txt={'Bank Account'}
                  txtStyle={styles.addPaymentMethodButtonTxt}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Spacer />
          <View style={styles.bSheetMid}>
            {checked == 'card' ? (
              <>
                <Input
                  label={'Card Number'}
                  placeholder={'Card Number'}
                  value={cardNumber}
                  setValue={setCardNumber}
                />
                <Spacer />
                <Input
                  label={'Name on Card'}
                  placeholder={'Name on Card'}
                  value={name}
                  setValue={setName}
                />
                <Spacer />
                <View style={styles.cvvView}>
                  <View style={styles.halfInput}>
                    <Input
                      label={'Expiration Date'}
                      placeholder={'MM/YY'}
                      value={expiry}
                      setValue={setExpiry}
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Input
                      label={'CVV'}
                      placeholder={'CVV'}
                      value={cvv}
                      setValue={setCvv}
                    />
                  </View>
                </View>
                <Spacer />
                <Spacer />
                <View style={globalStyles.row}>
                  <TouchableOpacity
                    onPress={() => {
                      setSaveCard(!saveCard);
                    }}>
                    <Image
                      source={saveCard ? checkedCheckbox : uncheckedCheckbox}
                      style={styles.checkbox}
                    />
                  </TouchableOpacity>
                  <Phrase txt={'Save Card'} />
                </View>
              </>
            ) : (
              <>
                <Spacer />

                <Input
                  label={'Account Title'}
                  placeholder={'Account Title'}
                  value={accountTitle}
                  setValue={setAccountTitle}
                />
                <Spacer />
                <Input
                  label={'Account Number'}
                  placeholder={'Account Number'}
                  value={accountNumber}
                  setValue={setAccountNumber}
                />
                <Spacer />
                <Input
                  label={'Bank Name'}
                  placeholder={'Bank Name'}
                  value={bankName}
                  setValue={setBankName}
                />
                <Spacer />
              </>
            )}
          </View>
          <View style={styles.bSheetBottom}>
            <MyButton
              label={'Add New Method'}
              txtColor={COLORS.white}
              btnColor={COLORS.secondary}
              borderColor={COLORS.secondary}
              onPress={() => refRBSheet.current.close()}
            />
          </View>
        </View>
      </RBSheet>
    </MasterLayout>
  );
};

export default PaymentInformation;
