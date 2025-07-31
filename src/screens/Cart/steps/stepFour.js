import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import {
  MasterLayout,
  BackBar,
  Phrase,
  Spacer,
  Hr,
  MyButton,
  Chip,
  Heading,
  Input,
  PrefixTextInput,
} from '@components';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import globalStyles from '@constants/global-styles';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  checkedRadio,
  uncheckedRadio,
  checked as checkedCheckbox,
  unchecked as uncheckedCheckbox,
} from '@constants/icons';
import {cod, card, tick} from '@constants/icons';
import {styles} from '../styles';
import {useTranslation} from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux';
import {setPaymentMethod} from '../../../store/reducers/global';
import {useIsFocused} from '@react-navigation/native';

const StepFour = ({}) => {
  const {t} = useTranslation();
  const refRBSheet = useRef();
  const [defaultMethod, setDefaultMethod] = useState('cod'); // Changed to string values
  const [checked, setChecked] = React.useState('card');
  const [saveCard, setSaveCard] = React.useState(false);
  const global = useSelector(state => state.global);
  console.log(global.cart_is_same_as_billing, 'cart_is_same_as_billing1');
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [cardNumber, setCardNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [bankName, setBankName] = useState('');
  useEffect(() => {
    !global.cart_is_sent_to_friend
      ? dispatch(setPaymentMethod('cod'))
      : dispatch(setPaymentMethod('online'));
    !global.cart_is_sent_to_friend
      ? setDefaultMethod('cod')
      : setDefaultMethod('online');
  }, [isFocused]);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Spacer />
      <Spacer />
      <View style={globalStyles.whiteBg}>
        {!global.cart_is_sent_to_friend && (
          <View
            style={[
              styles.methodContainer,
              {
                marginBottom: '2%',
                backgroundColor:
                  defaultMethod == 'cod' ? COLORS.secondaryLite : COLORS.white,
              },
            ]}>
            <View style={styles.leftView}>
              <Image source={cod} style={styles.methodImg} />
            </View>
            <View style={styles.midView}>
              <Phrase txt={t('cashOnDelivery')} txtStyle={styles.methodTitle} />
              <TouchableOpacity
                onPress={() => {
                  setDefaultMethod('cod');
                  dispatch(setPaymentMethod('cod'));
                }}>
                <Phrase
                  txt={
                    defaultMethod == 'cod' ? t('default') : t('setAsDefault')
                  }
                  txtStyle={styles.methodDefaultTxt}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.rightView}>
              {defaultMethod == 'cod' && (
                <Image source={tick} style={styles.tickImage} />
              )}
            </View>
          </View>
        )}
        <View
          style={[
            styles.methodContainer,
            {
              backgroundColor:
                defaultMethod == 'online' ? COLORS.secondaryLite : COLORS.white,
            },
          ]}>
          <View style={styles.leftView}>
            <Image source={cod} style={styles.methodImg} />
          </View>
          <View style={styles.midView}>
            <Phrase txt={t('payOnline')} txtStyle={styles.methodTitle} />
            <TouchableOpacity
              onPress={() => {
                setDefaultMethod('online');
                dispatch(setPaymentMethod('online'));
              }}>
              <Phrase
                txt={
                  defaultMethod == 'online' ? t('default') : t('setAsDefault')
                }
                txtStyle={styles.methodDefaultTxt}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.rightView}>
            {defaultMethod == 'online' && (
              <Image source={tick} style={styles.tickImage} />
            )}
          </View>
        </View>

        {/* Rest of your code remains the same */}
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
            backgroundColor: COLORS.bottomSheetBackground,
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <View
          style={[
            globalStyles.contentContainer,
            {marginHorizontal: SIZES.radius},
          ]}>
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
    </ScrollView>
  );
};

export default StepFour;
