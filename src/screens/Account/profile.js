import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {
  MasterLayout,
  BackBar,
  Phrase,
  Spacer,
  Hr,
  MyButton,
  OrderItem,
  Input,
  PrefixTextInput,
} from '@components';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import globalStyles from '@constants/global-styles';
import {styles} from './styles';
import {mail, lock, eye} from '@constants/icons';
import {useDispatch, useSelector} from 'react-redux';
import {callNonTokenApiMP} from '../../helpers/ApiRequest';
import config from '../../constants/config';
import {setLoader, setUser} from '../../store/reducers/global';
import {useTranslation} from 'react-i18next';

const Profile = () => {
  const {t} = useTranslation();
  const global = useSelector(state => state.global);
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const [firstName, setFirstName] = useState(global.user.name);
  const [lastName, setLstName] = useState(global.user.last_name);
  const [mobileNumber, setMobileNumber] = useState(global.user.mobile_number);
  const [email, setEmail] = useState(global.user.email);
  const [pass, setPass] = useState('');
  const [nPass, setNPass] = useState('');
  const [rnPass, setRnpass] = useState('');

  const updateProfile = async () => {
    let param = {};
    if (value === 1) {
      param = {
        name: firstName,
        last_name: lastName,
        mobile_number: mobileNumber,
        email: email,
        old_password: pass,
        password: nPass,
        confirm_password: rnPass,
      };
    } else {
      param = {
        name: firstName,
        last_name: lastName,
        mobile_number: mobileNumber,
        email: email,
      };
    }
    dispatch(setLoader(true));
    callNonTokenApiMP(config.apiName.updateProfile, 'POST', param)
      .then(res => {
        dispatch(setLoader(false));
        if (res.status === 200) {
          dispatch(setUser(res.data));
          setPass('');
          setRnpass('');
          setNPass('');
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
        <BackBar title={t('accountInformation')} navigateTo={'Account'} />
      </View>
      <Spacer />
      <View style={globalStyles.whiteBg}>
        <View style={globalStyles.contentContainer}>
          <View style={styles.pillsContainer}>
            <TouchableOpacity
              style={[
                styles.pillBtn,
                {
                  width: SIZES.fifty,
                  backgroundColor:
                    value === 0 ? COLORS.secondary : 'transparent',
                },
              ]}
              onPress={() => setValue(0)}>
              <Phrase
                txt={t('accountInfo')}
                txtStyle={{color: value === 0 ? COLORS.white : COLORS.black}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pillBtn,
                {
                  width: SIZES.fifty,
                  backgroundColor:
                    value === 1 ? COLORS.secondary : 'transparent',
                },
              ]}
              onPress={() => setValue(1)}>
              <Phrase
                txt={t('security')}
                txtStyle={{color: value === 1 ? COLORS.white : COLORS.black}}
              />
            </TouchableOpacity>
          </View>
          {value === 0 && (
            <>
              <Spacer />
              <View style={styles.cvvView}>
                <View style={styles.halfInput}>
                  <Input
                    label={t('firstName')}
                    placeholder={t('firstName')}
                    value={firstName}
                    setValue={setFirstName}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Input
                    label={t('lastName')}
                    placeholder={t('lastName')}
                    value={lastName}
                    setValue={setLstName}
                  />
                </View>
              </View>
              <Spacer />
              <PrefixTextInput
                label={t('mobileNumber')}
                placeholder={t('mobilePlaceholder')}
                prefix={'+974'}
                value={mobileNumber}
                setValue={setMobileNumber}
              />
              <Spacer />
              <Input
                label={t('emailAddress')}
                placeholder={'olivia@untitledui.com'}
                left={mail}
                isSecure={false}
                value={email}
                editable={false}
                setValue={setEmail}
              />
              <Spacer />
            </>
          )}
          {value === 1 && (
            <>
              <Spacer />
              <Input
                label={t('currentPassword')}
                placeholder={'********'}
                left={lock}
                right={eye}
                isSecure={true}
                value={pass}
                setValue={setPass}
              />
              <Spacer />
              <Input
                label={t('newPassword')}
                placeholder={'********'}
                left={lock}
                right={eye}
                isSecure={true}
                value={nPass}
                setValue={setNPass}
              />
              <Spacer />
              <Input
                label={t('reenterNewPassword')}
                placeholder={'********'}
                left={lock}
                right={eye}
                isSecure={true}
                value={rnPass}
                setValue={setRnpass}
              />
              <Spacer />
            </>
          )}
          <MyButton
            label={t('updateInformation')}
            txtColor={COLORS.secondary}
            btnColor={COLORS.secondaryLite}
            borderColor={COLORS.secondaryLite}
            onPress={updateProfile}
          />
        </View>
      </View>
    </MasterLayout>
  );
};

export default Profile;
