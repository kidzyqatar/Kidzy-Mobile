import {View, Text, Image, StyleSheet, Alert} from 'react-native';
import React, {useState} from 'react';
import {Button} from 'react-native-paper';
import {
  logo,
  mail,
  user,
  lock,
  eye,
  userSimple,
  googleIcon,
} from '@constants/icons';
import styles from './styles';
import {Input, Spacer, MyButton, Phrase} from '@components';
import {COLORS, FONTS, SIZES} from '@constants/theme';
import * as RootNavigation from '@navigators/RootNavigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {googleSigninPressed} from '../../helpers/AuthService';
import {useDispatch, useSelector} from 'react-redux';
import {
  setActiveTab,
  setCartSessionID,
  setIsLoggedIn,
  setLoader,
  setUser,
} from '../../store/reducers/global';
import {callNonTokenApi} from '../../helpers/ApiRequest';
import config from '../../constants/config';
import {getData, storeData} from '../../helpers/AsyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleReload} from '../../helpers/helper';
import constants from '../../constants/constants';
import {useTranslation} from 'react-i18next';

const RegisterForm = ({closeForm, toggleForm, page = true, completeCart}) => {
  const {t} = useTranslation();
  const global = useSelector(state => state.global);
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  var userData = {};

  const loginTunnel = async loginType => {
    console.log('Login Type is : ', loginType);

    switch (loginType) {
      case 'google-login':
        const googleUserPayload = await googleSigninPressed(userData);
        if (typeof googleUserPayload !== 'undefined') {
          socialLogin(googleUserPayload);
        }
        break;

      case 'ios-apple-login':
        break;

      case 'android-apple-login':
        break;

      default:
        break;
    }
  };

  const socialLogin = async userPayload => {
    dispatch(setLoader(true));

    try {
      callNonTokenApi(config.apiName.socialLogin, 'POST', userPayload)
        .then(async response => {
          if (response.status == 200) {
            var isDeviceLogin = await getData('is_device_login');
            if (!isDeviceLogin) {
              storeData('is_device_login', JSON.stringify(true), () => {});
            }
            storeData('access_token', response.data.access_token, () => {});
            dispatch(setIsLoggedIn(true));
            dispatch(setUser(response.data.user));
            dispatch(setLoader(false));
            bindUser();
            closeForm('Signup successful');
            handleReload(constants.HARD_RELOAD_TRUE, global.reload, dispatch);
            RootNavigation.navigate('Home');
            dispatch(setActiveTab(0));
          } else {
            Alert.alert('Error!', response.message);
          }
        })
        .catch(error => {
          console.log(error, '----');
          // crashlyticGenerator(error);
          dispatch(setLoader(false));
        });
    } catch (e) {
      console.log('lanadnadnad');
      // crashlyticGenerator(e);
      dispatch(setLoader(false));
    }
  };

  const SignUpUser = async => {
    dispatch(setLoader(true));

    try {
      callNonTokenApi(config.apiName.register, 'POST', {
        name: name,
        email: email,
        password: password,
      })
        .then(async response => {
          if (response.status == 200) {
            var isDeviceLogin = await getData('is_device_login');
            if (!isDeviceLogin) {
              storeData('is_device_login', JSON.stringify(true), () => {});
            }
            storeData('access_token', response.data.access_token, () => {});
            dispatch(setIsLoggedIn(true));
            dispatch(setUser(response.data.user));
            dispatch(setLoader(false));
            bindUser();
            closeForm('Signup sucessfully');
            handleReload(constants.HARD_RELOAD_TRUE, global.reload, dispatch);
            RootNavigation.navigate('Home');
            dispatch(setActiveTab(0));
          } else {
            Alert.alert('Error!', response.message);
          }
        })
        .catch(error => {
          console.log(error, '----');
          // crashlyticGenerator(error);
          dispatch(setLoader(false));
        });
    } catch (e) {
      console.log('lanadnadnad');
      // crashlyticGenerator(e);
      dispatch(setLoader(false));
    }
  };

  const bindUser = async () => {
    callNonTokenApi(config.apiName.bindAutheticatedUser, 'POST', {
      guest_session_id: global.cart_session_id,
    })
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          //
          // completeCart();
        } else {
          Alert.alert('Error!', response.data.message);
        }
      })
      .catch(err => {
        dispatch(setLoader(false));

        console.log(err);
      });
  };

  return (
    <View style={styles.content}>
      {page ? (
        <View style={styles.contentTopView}>
          <View style={styles.wrapper}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.pageHeading}>Sign Up</Text>
          </View>
        </View>
      ) : (
        <>
          <Spacer />
          <Spacer />
        </>
      )}

      <View
        style={[
          styles.contentMiddleView,
          {height: page ? SIZES.seventy : SIZES.hundred},
        ]}>
        <KeyboardAwareScrollView
          bounces={true}
          keyboardShouldPersistTaps={'handled'}
          extraScrollHeight={70}
          showsVerticalScrollIndicator={false}>
          <Input
            label={t('fullName')}
            placeholder={t('Adam Jone')}
            left={user}
            isSecure={false}
            value={name}
            setValue={setName}
          />
          <Spacer />
          <Input
            label={t('email')}
            placeholder={'olivia@untitledui.com'}
            left={mail}
            isSecure={false}
            value={email}
            setValue={setEmail}
          />
          <Spacer />
          <Input
            label={t('password')}
            placeholder={'********'}
            left={lock}
            right={eye}
            isSecure={true}
            value={password}
            setValue={setPassword}
          />
          <Spacer />
          <Input
            label={t('confirmPassword')}
            placeholder={'********'}
            left={lock}
            right={eye}
            isSecure={true}
            value={confirmPass}
            setValue={setConfirmPass}
          />
          <Spacer />
          <MyButton
            label={t('signup')}
            txtColor={COLORS.white}
            icon={userSimple}
            iconPosition={'right'}
            btnColor={COLORS.secondary}
            onPress={SignUpUser}
          />
          <MyButton
            label={
              <Text style={styles.loginBtnTxt}>
                {t('alreadyAMember')}{' '}
                <Text style={styles.loginBtnTxtInner}>{t('login')}</Text>
              </Text>
            }
            txtColor={COLORS.black}
            btnColor={COLORS.white}
            borderColor={COLORS.black}
            onPress={() => {
              toggleForm();
            }}
          />

          <MyButton
            label={t('continueWithGoogle')}
            txtColor={COLORS.black}
            btnColor={COLORS.white}
            borderColor={COLORS.black}
            icon={googleIcon}
            iconPosition={'left'}
            onPress={() => {
              loginTunnel('google-login');
            }}
          />
        </KeyboardAwareScrollView>
      </View>
      {page && (
        <View style={styles.contentBottomView}>
          <Text style={styles.privacyTxt}>
            {"By continuing, you agree to Kidzy's Terms of Use \n and"}

            <Text
              style={styles.privacyTxtLink}
              onPress={() => {
                console.log('Privacy bhai');
              }}>
              {' '}
              {'Privacy Policy.'}
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
};

export default RegisterForm;
