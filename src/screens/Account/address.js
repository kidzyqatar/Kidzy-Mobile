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
import {useTranslation} from 'react-i18next';

export default function Address() {
  const {t} = useTranslation();

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
          Alert.alert(t('error'), res.message);
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
          setAddresses(res.data.addresses);
        } else {
          Alert.alert(t('error'), res.message);
        }
      })
      .catch(err => {
        dispatch(setLoader(false));
      });
  };

  return (
    <MasterLayout bgColor={COLORS.bgGray} scrolling={false} max={true}>
      <View style={globalStyles.whiteBg}>
        <BackBar title={t('addresses')} navigateTo={'Account'} />
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
                      txt={t('addressName')}
                      txtStyle={styles.addressNameTitle}
                    />
                    {/* 
                    {item.is_default_billing == 1 ? (
                      <Chip
                        status={t('default')}
                        bgColor={COLORS.secondary + '1A'}
                        txtColor={COLORS.secondary}
                      />
                    ) : (
                      <Chip
                        status={t('makeDefaultAddress')}
                        bgColor={COLORS.secondary + '1A'}
                        txtColor={COLORS.secondary}
                      />
                    )}
                    */}
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
          label={t('addNewAddress')}
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
            <>
              <Spacer />
              <Input
                label={t('firstName')}
                placeholder={t('firstName')}
                setValue={setFirstName}
              />
              <Spacer />
              <Input
                label={t('lastName')}
                placeholder={t('lastName')}
                setValue={setLastName}
              />
              <Spacer />
              <PrefixTextInput
                label={t('mobileNumber')}
                placeholder={t('mobilePlaceholder')}
                prefix={'+974'}
                value={mobileNumber}
                maxLength={9}
                setValue={setMobileNumber}
              />
              <Spacer />
              <Input
                label={t('street')}
                placeholder={t('streetPlaceholder')}
                value={street}
                setValue={setStreet}
              />
              <Spacer />
              <View style={styles.cvvView}>
                <View style={styles.halfInput}>
                  <Input
                    label={t('city')}
                    placeholder={t('cityPlaceholder')}
                    value={city}
                    setValue={setCity}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Input
                    label={t('province')}
                    placeholder={t('provincePlaceholder')}
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
                label={t('defaultBillingAddress')}
              />
              <Spacer />
              <Checkbox
                state={defaultShipping}
                stateChanger={setDefaultShipping}
                label={t('defaultShippingAddress')}
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
        )}
      </RBSheet>
    </MasterLayout>
  );
}
