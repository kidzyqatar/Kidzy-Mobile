import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
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
  addCircle,
  calendar,
  clock,
  mouse,
  minus,
  plus,
  balloon,
} from '@constants/icons';
import {styles} from '../styles';
import Checkbox from '../../../components/Checkbox/Checkbox';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {formatDate} from '../../../helpers/helper';
import {useDispatch, useSelector} from 'react-redux';
import {
  callNonTokenApi,
  callNonTokenApiAddress,
} from '../../../helpers/ApiRequest';
import config from '../../../constants/config';
import {
  setBallonsCount,
  setCart,
  setCartCalculations,
  setLoader,
  setSameAsBillingAddress,
  setSelectedBillingAddress,
  setSelectedCharacter,
  setSelectedDeliveryDate,
  setSelectedDeliveryTime,
  setSelectedShippingAddress,
  setSentToFriend,
} from '../../../store/reducers/global';
import {TextInput} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

const StepThree = ({incrementBallonQuantity, decrementBallonQuantity}) => {
  const {t} = useTranslation();
  const global = useSelector(state => state.global);
  const dispatch = useDispatch();

  const refRBSheet = useRef();
  const refRBSheetFriendAddress = useRef();
  const refRBSheetTimings = useRef();
  const refRBSheetBalloon = useRef();

  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [sendToFriend, setSendToFriend] = useState(false);

  const [calcDate, setCalcDate] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  const [character, setCharacter] = useState();

  const [openDate, setOpenDate] = useState(false);

  //billing
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [defaultShipping, setDefaultShipping] = useState(1);
  const [defaultBilling, setDefaultBilling] = useState(1);

  //shipping
  const [s_firstName, s_setFirstName] = useState('');
  const [s_lastName, s_setLastName] = useState('');
  const [s_mobileNumber, s_setMobileNumber] = useState('');
  const [s_street, s_setStreet] = useState('');
  const [s_city, s_setCity] = useState('');
  const [s_province, s_setProvince] = useState('');

  const [addresses, setAddresses] = useState(null);
  const [quantityBalloon, setQuantityBalloon] = useState(0);

  const deliveryTimes = [
    {label: '12:00am - 03:00pm', value: '03:00:00'},
    {label: '03:00pm - 06:00pm', value: '06:00:00'},
    {label: '06:00pm - 09:00pm', value: '09:00:00'},
    {label: '09:00pm - 12:00am', value: '12:00:00'},
  ];

  useEffect(() => {
    getAddresses();
  }, []);

  useEffect(() => {
    if (sendToFriend) {
      dispatch(setSelectedShippingAddress(global.cart_shipping_address));
    } else {
      dispatch(setSelectedShippingAddress(global.cart_billing_address));
    }
    dispatch(setSentToFriend(sendToFriend));
  }, [sendToFriend]);

  const copyBillingAddress = () => {
    setSameAsBilling(!sameAsBilling);
    setSendToFriend(!sendToFriend);
    // if (!sameAsBilling) {
    //   dispatch(setSelectedShippingAddress(selectedAddress))
    // } else {
    //   dispatch(setSelectedShippingAddress(shippingAddress))
    // }
    dispatch(setSameAsBillingAddress(!sameAsBilling));
  };

  const copyFriendAddress = () => {
    setSameAsBilling(!sameAsBilling);
    setSendToFriend(!sendToFriend);
    // if (sendToFirend) {
    //   dispatch(setSelectedShippingAddress(shippingAddress))
    // } else {
    //   dispatch(setSelectedShippingAddress(selectedAddress))
    // }
    dispatch(setSentToFriend(!sendToFriend));
  };

  const characters = global.allCharacters;

  const addShippingAddress = async () => {
    refRBSheetFriendAddress.current.close();
    let params = {
      guest_session_id: global.cart_session_id,
      first_name: s_firstName,
      last_name: s_lastName,
      mobile_number: s_mobileNumber,
      street: s_street,
      city: s_city,
      state: s_province,
      is_default_shipping: false,
      is_default_billing: false,
    };
    if (global.isLoggedIn) {
      params['user_id'] = global.user.id;
    }
    dispatch(setLoader(true));
    callNonTokenApiAddress(config.apiName.addAddress, 'POST', params)
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          s_setFirstName('');
          s_setLastName('');
          s_setMobileNumber('');
          s_setStreet('');
          s_setCity('');
          s_setProvince('');
          dispatch(setSelectedShippingAddress(res.data.address));
          addShippingAddressToCart(res.data.address);
          getAddresses();
        } else {
          Alert.alert('Error!', res.message);
        }
      })
      .catch(err => {
        console.log(err);
        Alert.alert('Error', 'Error while adding shipping Address');
        dispatch(setLoader(false));
      });
  };

  const addShippingAddressToCart = async address => {
    callNonTokenApi(config.apiName.addAddressToCart, 'POST', {
      address_id: address.id,
      order_id: global.cart.id,
      type: 'shipping',
    })
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          console.log(res);
        } else {
          Alert.alert('Error!', res.message);
        }
      })
      .catch(err => {
        Alert.alert('Error', 'Error while binding shipping Address');
        dispatch(setLoader(false));
        console.log(err);
      });
  };

  const addAddress = async () => {
    refRBSheet.current.close();
    let params = {
      guest_session_id: global.cart_session_id,
      first_name: firstName,
      last_name: lastName,
      mobile_number: mobileNumber,
      street: street,
      city: city,
      state: province,
      is_default_billing: true,
      is_default_shipping: true,
    };
    if (global.isLoggedIn) {
      params['user_id'] = global.user.id;
    }
    dispatch(setLoader(true));
    callNonTokenApiAddress(config.apiName.addAddress, 'POST', params)
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          setFirstName('');
          setLastName('');
          setMobileNumber('');
          setStreet('');
          setCity('');
          setProvince('');
          setDefaultShipping(0);
          setDefaultBilling(0);
          dispatch(setSelectedBillingAddress(res.data.address));
          addAddressToCart(res.data.address);
          getAddresses();
        } else {
          Alert.alert('Error!', res.message);
        }
      })
      .catch(err => {
        dispatch(setLoader(false));
      });
  };

  const getAddresses = async () => {
    dispatch(setLoader(true));
    callNonTokenApi(config.apiName.getAddresses, 'POST', {
      guest_session_id: global.cart_session_id,
    })
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          const {addresses} = res.data;
          setAddresses(res.data.addresses);

          if (!global.cart_billing_address) {
            const selectedBilling =
              addresses.find(x => x.is_default_billing == true) || addresses[0];
            dispatch(setSelectedBillingAddress(selectedBilling));
            addAddressToCart(res.data.addresses[0]);
          }

          if (!global.cart_shipping_address) {
            const selectedShipping =
              addresses.find(x => x.is_default_shipping == true) ||
              addresses[0];
            dispatch(setSelectedShippingAddress(selectedShipping));
            addShippingAddressToCart(selectedShipping);
          }
        } else {
          Alert.alert('Error!', res.message);
        }
      })
      .catch(err => {
        dispatch(setLoader(false));
      });
  };

  const addAddressToCart = async address => {
    dispatch(setLoader(true));

    callNonTokenApi(config.apiName.addAddressToCart, 'POST', {
      address_id: address.id,
      order_id: global.cart.id,
      type: 'billing',
    })
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          console.log(res.data);
        } else {
          Alert.alert('Error!', res.message);
        }
      })
      .catch(err => {
        dispatch(setLoader(false));
        console.log(err);
      });
  };

  const incrementQuantity = () => {
    setQuantityBalloon(quantityBalloon + 1);
    dispatch(setBallonsCount(quantityBalloon + 1));

    incrementBallonQuantity(quantityBalloon + 1);
  };

  const decrementQuantity = () => {
    if (quantityBalloon > 0) {
      setQuantityBalloon(quantityBalloon - 1);
      dispatch(setBallonsCount(quantityBalloon - 1));
      decrementBallonQuantity(quantityBalloon + 1);
    } else {
      refRBSheetBalloon.current.open();
    }
    dispatch(setCart(global.cart));
  };

  const SendToFriendAddressInput = () => {
    return (
      <RBSheet
        ref={refRBSheetFriendAddress}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={670}
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
          <Heading
            txt={t('addNewAddress')}
            txtStyle={styles.bSheetTopHeading}
          />
          <Spacer />
          {/* {<AddressForm />} */}
          <>
            <Spacer />
            <Input
              label={t(`recipientFirstName`)}
              placeholder={t('firstName')}
              value={s_firstName}
              setValue={s_setFirstName}
            />
            <Spacer />
            <Input
              label={t('recipientLastName')}
              placeholder={t('lastName')}
              value={s_lastName}
              setValue={s_setLastName}
            />
            <Spacer />
            <PrefixTextInput
              label={t('mobileNumber')}
              placeholder={'000-000-000'}
              prefix={'+974'}
              value={s_mobileNumber}
              maxLength={9}
              setValue={s_setMobileNumber}
            />
            <Spacer />
            <Input
              label={t('street')}
              placeholder={t('pleaseProvideStreetAddress')}
              value={s_street}
              setValue={s_setStreet}
            />
            <Spacer />

            <View style={styles.cvvView}>
              <View style={styles.halfInput}>
                <Input
                  label={t('city')}
                  placeholder={t('exampleAlWakra')}
                  value={s_city}
                  setValue={s_setCity}
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label={t('stateProvinceArea')}
                  placeholder={t('exampleDoha')}
                  value={s_province}
                  setValue={s_setProvince}
                />
              </View>
            </View>
            <Spacer />
            <Spacer />
          </>

          <View style={[styles.bSheetBottom, {justifyContent: 'center'}]}>
            <MyButton
              label={t('addAddress')}
              txtColor={COLORS.white}
              btnColor={COLORS.secondary}
              borderColor={COLORS.secondary}
              onPress={addShippingAddress}
            />
          </View>
        </View>
      </RBSheet>
    );
  };

  const BillingAddresses = () => {
    return (
      <FlatList
        data={addresses}
        renderItem={({item}) => (
          <View style={[styles.addressContainer]}>
            <View
              style={[
                globalStyles.row,
                globalStyles.alignCenter,
                {alignItems: 'flex-start'},
              ]}>
              <View style={{width: SIZES.ten}}>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setSelectedBillingAddress(item));
                    addAddressToCart(item);
                  }}>
                  <Image
                    source={
                      global.cart_billing_address.id === item.id
                        ? checkedRadio
                        : uncheckedRadio
                    }
                    style={styles.checkbox}
                  />
                </TouchableOpacity>
              </View>
              <View style={{width: SIZES.ninty}}>
                <View style={globalStyles.row}>
                  <Phrase txt={'Home: '} txtStyle={styles.addressNameTitle} />
                  {item.is_default_billing ? (
                    <Chip
                      status={'Default'}
                      bgColor={COLORS.secondary + '1A'}
                      txtColor={COLORS.secondary}
                    />
                  ) : null}
                </View>

                <Phrase
                  txt={`${item.first_name} ${item.last_name}, ${item.street}, ${item.city}, ${item.state}`}
                  txtStyle={styles.addressName}
                />
                <Phrase
                  txt={`${item.mobile_number}`}
                  txtStyle={styles.addressName}
                />
              </View>
            </View>
          </View>
        )}
      />
    );
  };

  const ShippingAddresses = () => {
    return (
      <FlatList
        data={addresses}
        renderItem={({item}) => (
          <View style={[styles.addressContainer]}>
            <View
              style={[
                globalStyles.row,
                globalStyles.alignCenter,
                {alignItems: 'flex-start'},
              ]}>
              <View style={{width: SIZES.ten}}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedShippingAddress(item);
                    addShippingAddressToCart(item);
                  }}>
                  <Image
                    source={
                      global.cart_billing_address.id === item.id
                        ? checkedRadio
                        : uncheckedRadio
                    }
                    style={styles.checkbox}
                  />
                </TouchableOpacity>
              </View>
              <View style={{width: SIZES.ninty}}>
                <View style={globalStyles.row}>
                  <Phrase txt={'Home: '} txtStyle={styles.addressNameTitle} />
                  {item.is_default_shipping ? (
                    <Chip
                      status={'Default'}
                      bgColor={COLORS.secondary + '1A'}
                      txtColor={COLORS.secondary}
                    />
                  ) : null}
                </View>

                <Phrase
                  txt={`${item.first_name} ${item.last_name}, ${item.street}, ${item.city}, ${item.state}`}
                  txtStyle={styles.addressName}
                />
                <Phrase
                  txt={`${item.mobile_number}`}
                  txtStyle={styles.addressName}
                />
              </View>
            </View>
          </View>
        )}
      />
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 100}}>
      <Spacer />
      {/* Address Section */}
      <View style={[globalStyles.whiteBg, globalStyles.contentContainer]}>
        <Phrase
          txt={t('pleaseChooseBillingAddress')}
          txtStyle={{...FONTS.body5_bold}}
        />
        <Spacer />
        <BillingAddresses />
        <Spacer />
        <MyButton
          label={t('addNewAddress')}
          txtColor={COLORS.secondary}
          btnColor={COLORS.secondaryLite}
          borderColor={COLORS.secondaryLite}
          btnStyle={{width: SIZES.fifty}}
          icon={addCircle}
          onPress={() => refRBSheet.current.open()}
        />
      </View>
      {/* Address Section */}
      <Spacer />
      {/* Send to Friend Section */}
      <View style={[globalStyles.whiteBg, globalStyles.contentContainer]}>
        <Phrase
          txt={t('pleaseChooseShippingAddress')}
          txtStyle={{...FONTS.body5_bold}}
        />
        <Spacer />
        <Checkbox
          state={sameAsBilling}
          stateChanger={copyBillingAddress}
          label={t('sameAsBillingAddress')}
        />
        <Spacer />
        <Checkbox
          state={sendToFriend}
          stateChanger={copyFriendAddress}
          label={t('sendingItToAFriend')}
        />
        {sendToFriend ? (
          <>
            <MyButton
              label={t('addNewAddress')}
              txtColor={COLORS.secondary}
              btnColor={COLORS.secondaryLite}
              borderColor={COLORS.secondaryLite}
              btnStyle={{width: SIZES.fifty}}
              icon={addCircle}
              onPress={() => refRBSheetFriendAddress.current.open()}
            />
            <SendToFriendAddressInput />
          </>
        ) : null}
      </View>

      {/* Send to Friend Section */}
      <Spacer />
      {/* Timing Section */}
      <View style={[globalStyles.whiteBg, globalStyles.contentContainer]}>
        <Phrase
          txt={t('deliveryDateAndTime')}
          txtStyle={{...FONTS.body5_bold}}
        />
        <Spacer />
        <View>
          <TouchableOpacity
            onPress={() => setOpenDate(true)}
            style={{
              ...StyleSheet.absoluteFill,
              zIndex: 3,
            }}
          />

          <Input
            label={t('chooseDeliveryDate')}
            placeholder={t('selectDate')}
            value={deliveryDate}
            right={calendar}
            customStyle={{zIndex: 1}}
          />
        </View>
        <Spacer />
        <View>
          <TouchableOpacity
            onPress={() => {
              refRBSheetTimings.current.open();
            }}
            style={{
              ...StyleSheet.absoluteFill,
              zIndex: 3,
            }}
          />
          <Input
            label={t('chooseDeliveryTime')}
            placeholder={t('selectTime')}
            value={deliveryTime.label}
            setValue={setDeliveryTime}
            right={clock}
            customStyle={{zIndex: 1}}
          />
        </View>
      </View>
      {/* Timing Section */}
      <Spacer />
      {/* Special delivery section */}
      <View style={[globalStyles.whiteBg, globalStyles.contentContainer]}>
        <Phrase
          txt={t('specialInstructionsOptional')}
          txtStyle={{...FONTS.body5_bold}}
        />
        <Phrase
          txt={t('specialInstructionsText')}
          txtStyle={{
            marginVertical: SIZES.radius,
            ...FONTS.body6,
            color: COLORS.txtGray,
          }}
        />
        <Spacer />

        <FlatList
          horizontal={true}
          scrollEnabled={true}
          data={characters}
          renderItem={({item}) => (
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.character,
                  {
                    borderWidth: character == item.id ? 3 : 1,
                    borderColor:
                      character == item.id ? COLORS.secondary : COLORS.grayBg,
                  },
                ]}
                onPress={() => {
                  setCharacter(item.id);
                  dispatch(setSelectedCharacter(item));
                }}>
                <Image
                  source={{uri: item.full_image}}
                  style={styles.characterImg}
                />
              </TouchableOpacity>
              <Phrase
                txt={`QAR ${item.price}`}
                txtStyle={{
                  ...FONTS.body5_bold,
                  color:
                    character == item.id ? COLORS.secondary : COLORS.txtGray,
                }}
              />
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>
      {/* Special delivery section */}
      <Spacer />
      {/* Special balloons section */}
      <View style={[globalStyles.whiteBg, globalStyles.contentContainer]}>
        <Phrase
          txt={t('addBalloonsOptional')}
          txtStyle={{...FONTS.body5_bold}}
        />
        <Phrase
          txt={t('addBalloonsText')}
          txtStyle={{
            marginVertical: SIZES.radius,
            ...FONTS.body6,
            color: COLORS.txtGray,
          }}
        />
        <Spacer />
        <View style={styles.balloonSectionContainer}>
          <Phrase txt={t('quantity')} txtStyle={{...FONTS.body4}} />
          <View style={styles.calcView}>
            <TouchableOpacity
              onPress={() => {
                decrementQuantity();
              }}>
              <Image source={minus} style={styles.calcImg} />
            </TouchableOpacity>
            <Phrase txt={quantityBalloon} txtStyle={styles.calcTxt} />
            <TouchableOpacity
              onPress={() => {
                incrementQuantity();
              }}>
              <Image source={plus} style={styles.calcImg} />
            </TouchableOpacity>
          </View>
          <Phrase
            txt={`QAR ${global.balloon_charges}`}
            txtStyle={{...FONTS.body4_bold, color: COLORS.secondary}}
          />
        </View>
      </View>
      {/* Special balloons section */}

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={740}
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
          <Heading
            txt={t('addNewAddress')}
            txtStyle={styles.bSheetTopHeading}
          />
          <Spacer />
          {/* {<AddressForm />} */}
          <>
            <Spacer />
            <Input
              label={t('firstName')}
              placeholder={t('firstName')}
              // value={firstName}
              setValue={setFirstName}
            />
            <Spacer />
            <Input
              label={t('lastName')}
              placeholder={t('lastName')}
              // value={lastName}
              setValue={setLastName}
            />
            <Spacer />
            <PrefixTextInput
              label={t('mobileNumber')}
              placeholder={'000-000-000'}
              prefix={'+974'}
              value={mobileNumber}
              setValue={setMobileNumber}
            />
            <Spacer />
            <Input
              label={t('street')}
              placeholder={t('pleaseProvideStreetAddress')}
              value={street}
              setValue={setStreet}
            />
            <Spacer />

            <View style={styles.cvvView}>
              <View style={styles.halfInput}>
                <Input
                  label={t('city')}
                  placeholder={t('exampleAlWakra')}
                  value={city}
                  setValue={setCity}
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label={t('stateProvinceArea')}
                  placeholder={t('exampleDoha')}
                  value={province}
                  setValue={setProvince}
                />
              </View>
            </View>
            <Spacer />
            <Spacer />
            <Checkbox
              state={defaultBilling}
              stateChanger={setDefaultBilling}
              label={t('markAsDefaultBillingAddress')}
            />
            <Spacer />
            <Checkbox
              state={defaultShipping}
              stateChanger={setDefaultShipping}
              label={t('markAsDefaultShippingAddress')}
            />
          </>

          <View style={[styles.bSheetBottom, {justifyContent: 'center'}]}>
            <MyButton
              label={t('addAddress')}
              txtColor={COLORS.white}
              btnColor={COLORS.secondary}
              borderColor={COLORS.secondary}
              onPress={addAddress}
            />
          </View>
        </View>
      </RBSheet>
      <DatePicker
        modal
        open={openDate}
        date={calcDate}
        mode={'date'}
        onConfirm={date => {
          setOpenDate(false);
          setCalcDate(date);
          const value = moment(date).format('YYYY-MM-DD');
          setDeliveryDate(value);
          dispatch(setSelectedDeliveryDate(value));
          console.log(deliveryDate, global.cart_delivery_date);
        }}
        onCancel={() => {
          setOpenDate(false);
        }}
      />

      <RBSheet
        ref={refRBSheetTimings}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={300}
        minClosingHeight={0}
        customStyles={{
          wrapper: {
            backgroundColor: COLORS.bottomSheetBackground,
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
          container: {paddingHorizontal: SIZES.padding},
        }}>
        <Phrase
          txt={'Select Delivery Time Slot'}
          txtStyle={{...FONTS.body4_bold, marginBottom: SIZES.padding}}
        />
        {deliveryTimes.map((element, index) => {
          return (
            <TouchableOpacity
              key={index.toString()}
              style={{width: SIZES.hundred, height: 40}}
              onPress={() => {
                setDeliveryTime(element);
                dispatch(setSelectedDeliveryTime(element.value));
              }}>
              <Phrase
                txt={element.label}
                txtStyle={{
                  ...FONTS.body4_medium,
                  color:
                    deliveryTime.label == element.label
                      ? COLORS.secondary
                      : COLORS.txtGray,
                }}
              />
            </TouchableOpacity>
          );
        })}
        <View style={[styles.bSheetBottom, {justifyContent: 'center'}]}>
          <MyButton
            label={'Save'}
            txtColor={COLORS.white}
            btnColor={COLORS.secondary}
            borderColor={COLORS.secondary}
            onPress={() => {
              dispatch(setSelectedDeliveryTime(deliveryTime));
              console.log(global.cart_delivery_time);
              refRBSheetTimings.current.close();
            }}
          />
        </View>
      </RBSheet>

      <RBSheet
        ref={refRBSheetBalloon}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={350}
        minClosingHeight={0}
        customStyles={{
          wrapper: {
            backgroundColor: COLORS.bottomSheetBackground,
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
          container: {paddingHorizontal: SIZES.radius},
        }}>
        <View>
          <Image
            source={balloon}
            style={{width: 100, height: 100, resizeMode: 'contain'}}
          />
          <Phrase
            txt={t('notAddingBalloons')}
            txtStyle={{...FONTS.body4_bold, marginBottom: SIZES.radius}}
          />
          <Phrase
            txt={t('notAddingBalloonsText')}
            txtStyle={{
              ...FONTS.body6,
              marginBottom: SIZES.radius,
              color: COLORS.txtGray,
            }}
          />
          <MyButton
            label={t('noWait')}
            txtColor={COLORS.white}
            btnColor={COLORS.secondary}
            borderColor={COLORS.secondary}
            onPress={() => refRBSheetBalloon.current.close()}
          />
          <MyButton
            label={t('skip')}
            txtColor={COLORS.black}
            btnColor={COLORS.white}
            borderColor={COLORS.black}
            onPress={() => refRBSheetBalloon.current.close()}
          />
        </View>
      </RBSheet>
    </ScrollView>
  );
};

export default StepThree;
