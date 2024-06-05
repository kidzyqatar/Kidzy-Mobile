import React, {useEffect, useRef, useState} from 'react';
import {Image, TouchableOpacity, View, FlatList, Alert} from 'react-native';
import {Avatar} from 'react-native-paper';
import {avatar} from '@constants/images';
import {
  myOrders,
  myWallet,
  myPaymentInformation,
  myAddress,
  myUser,
  back,
} from '@constants/icons';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import {
  MasterLayout,
  Phrase,
  Spacer,
  Hr,
  MyButton,
  BackBar,
  Chip,
  Heading,
  Input,
  PrefixTextInput,
} from '@components';
import globalStyles from '@constants/global-styles';
import {styles} from './styles';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  checkedRadio,
  uncheckedRadio,
  checked as checkedCheckbox,
  unchecked as uncheckedCheckbox,
} from '@constants/icons';
import {useDispatch, useSelector} from 'react-redux';
import {setLoader} from '../../store/reducers/global';
import {
  callNonTokenApi,
  callNonTokenApiAddress,
} from '../../helpers/ApiRequest';
import config from '../../constants/config';
import ActivityIndicatorOverlay from '../../components/ActivityIndicator/ActivityIndicatorOverlay';
import Checkbox from '../../components/Checkbox/Checkbox';
import {handleReload} from '../../helpers/helper';
import constants from '../../constants/constants';

export default function Address() {
  const dispatch = useDispatch();
  const global = useSelector(state => state.global);
  const refRBSheet = useRef();
  const [defaultMethod, setDefaultMethod] = useState(1);
  const [defaultShipping, setDefaultShipping] = useState(1);
  const [defaultBilling, setDefaultBilling] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [addresses, setAddresses] = useState('');

  useEffect(() => {
    getAddresses();
  }, []);

  useEffect(() => {}, [addresses]);

  const addAddress = async () => {
    refRBSheet.current.close();
    dispatch(setLoader(true));
    let params = {
      guest_session_id: global.cart_session_id,
      first_name: firstName,
      last_name: lastName,
      mobile_number: mobileNumber,
      street: street,
      city: city,
      state: province,
      is_default_billing: defaultBilling,
      is_default_shipping: defaultShipping,
    };
    if (global.isLoggedIn) {
      params['user_id'] = global.user.id;
    }
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
          getAddresses();
          handleReload(constants.HARD_RELOAD_FALSE, global.reload, dispatch);
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
          console.log(res.addresses);
          setAddresses(res.data.addresses);
        } else {
          Alert.alert('Error!', res.message);
        }
      })
      .catch(err => {
        dispatch(setLoader(false));
      });
  };

  return (
    <MasterLayout bgColor={COLORS.bgGray} scrolling={false} max={true}>
      <View style={globalStyles.whiteBg}>
        <BackBar title={'Addresses'} navigateTo={'Account'} />
      </View>
      <Spacer />
      <Spacer />
      <View style={[globalStyles.whiteBg, globalStyles.contentContainer]}>
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
                <View style={{width: SIZES.ninty}}>
                  <View style={globalStyles.row}>
                    <Phrase
                      txt={'Address name: '}
                      txtStyle={styles.addressNameTitle}
                    />
                    {/* {item.is_default_billing == 1 ? (
                      <Chip
                        status={'Default'}
                        bgColor={COLORS.secondary + '1A'}
                        txtColor={COLORS.secondary}
                      />
                    ) : (
                      <Chip
                        status={'Make Default Address'}
                        bgColor={COLORS.secondary + '1A'}
                        txtColor={COLORS.secondary}
                      />
                    )} */}
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
      </View>

      <View style={[globalStyles.whiteBg, globalStyles.contentContainer]}>
        <MyButton
          label={'Add New Method'}
          txtColor={COLORS.secondary}
          btnColor={COLORS.secondaryLite}
          borderColor={COLORS.secondaryLite}
          onPress={() => refRBSheet.current.open()}
        />
      </View>

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={740}
        minClosingHeight={0}
        customStyles={{
          wrapper: {
            backgroundColor: COLORS.black,
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        {global.loader ? (
          <ActivityIndicatorOverlay visible={true} />
        ) : (
          // <View />
          <View
            style={[
              globalStyles.contentContainer,
              {marginHorizontal: SIZES.radius},
            ]}>
            <Heading
              txt={'Add New Address'}
              txtStyle={styles.bSheetTopHeading}
            />
            <Spacer />
            {/* {<AddressForm />} */}
            <>
              <Spacer />
              <Input
                label={'First Name'}
                placeholder={'First Name'}
                // value={firstName}
                setValue={setFirstName}
              />
              <Spacer />
              <Input
                label={'Last name'}
                placeholder={'Last name'}
                // value={lastName}
                setValue={setLastName}
              />
              <Spacer />
              <PrefixTextInput
                label={'Mobile Number'}
                placeholder={'000-000-000'}
                prefix={'+974'}
                value={mobileNumber}
                maxLength={9}
                setValue={setMobileNumber}
              />
              <Spacer />
              <Input
                label={'Street'}
                placeholder={'Please provide street address'}
                value={street}
                setValue={setStreet}
              />
              <Spacer />

              <View style={styles.cvvView}>
                <View style={styles.halfInput}>
                  <Input
                    label={'City'}
                    placeholder={'e.g Al Wakra'}
                    value={city}
                    setValue={setCity}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Input
                    label={'State/Province/Area'}
                    placeholder={'e.g Doha'}
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
                label={'Mark as Default Billing Address'}
              />
              <Spacer />
              <Checkbox
                state={defaultShipping}
                stateChanger={setDefaultShipping}
                label={'Mark as Default Shipping Address'}
              />
            </>

            <View style={[styles.bSheetBottom, {justifyContent: 'center'}]}>
              <MyButton
                label={'Add Address'}
                txtColor={COLORS.white}
                btnColor={COLORS.secondary}
                borderColor={COLORS.secondary}
                onPress={addAddress}
              />
            </View>
          </View>
        )}
      </RBSheet>
    </MasterLayout>
  );
}
