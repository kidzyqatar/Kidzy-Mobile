import {View, Text, Image, StyleSheet, Alert} from 'react-native';
import React, {useState} from 'react';
import {
  logo,
  mail,
  user,
  lock,
  eye,
  userSimple,
  googleIcon,
} from '@constants/icons';
import {MasterLayout, Input, Spacer, MyButton, Phrase} from '@components';
import {COLORS, FONTS, SIZES} from '@constants/theme';
import * as RootNavigation from '@navigators/RootNavigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import {googleSigninPressed} from '../../helpers/AuthService';
import {
  setActiveTab,
  setIsLoggedIn,
  setLoader,
  setUser,
} from '../../store/reducers/global';
import {callNonTokenApi} from '../../helpers/ApiRequest';
import config from '../../constants/config';
import {getData, storeData} from '../../helpers/AsyncStorage';
import {useDispatch, useSelector} from 'react-redux';
import {setCartSessionID} from '../../store/reducers/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleReload} from '../../helpers/helper';
import constants from '../../constants/constants';

const LoginForm = ({closeForm, page = true, completeCart}) => {
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
        const iosAppleUserPayload = await onAppleButtonPressIOS(userData);
        if (typeof iosAppleUserPayload !== 'undefined') {
          socialLogin(iosAppleUserPayload);
        }
        break;
      case 'android-apple-login':
        const androidAppleUserPayload = await onAppleButtonPressANDROID(
          userData,
        );
        if (typeof androidAppleUserPayload !== 'undefined') {
          socialLogin(androidAppleUserPayload);
        }
        break;

      default:
        break;
    }
  };

  const loginWithEmail = async userPayload => {
    if (email === null) {
      return;
    }
    if (password === null) {
      return;
    }
    dispatch(setLoader(true));
    try {
      callNonTokenApi(config.apiName.login, 'POST', {
        email: email,
        password: password,
      })
        .then(async response => {
          console.log('called', response);
          if (response.status == 200) {
            console.log('I am from inner response', response.data);
            const allow = false;
            var isDeviceLogin = await getData('is_device_login');
            if (!isDeviceLogin) {
              storeData('is_device_login', JSON.stringify(true), () => {});
            }
            storeData('access_token', response.data.access_token, () => {});
            dispatch(setIsLoggedIn(true));
            dispatch(setUser(response.data.user));
            dispatch(setLoader(false));
            bindUser();
            closeForm('Login successfully');
            handleReload(constants.HARD_RELOAD_FALSE, global.reload, dispatch);
            RootNavigation.navigate('Home');
            dispatch(setActiveTab(0));
          } else {
            dispatch(setLoader(false));
            console.log('called ahere', response.message);
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

  const socialLogin = async userPayload => {
    dispatch(setLoader(true));
    let route = '';
    try {
      callNonTokenApi(config.apiName.socialLogin, 'POST', userPayload)
        .then(async response => {
          console.log('called', response);
          dispatch(setLoader(false));
          if (response.status == 200) {
            const allow = false;
            var isDeviceLogin = await getData('is_device_login');
            if (!isDeviceLogin) {
              storeData('is_device_login', JSON.stringify(true), () => {});
            }
            storeData('access_token', response.data.access_token, () => {});
            dispatch(setIsLoggedIn(true));
            dispatch(setUser(response.data.user));
            bindUser();

            closeForm('Login successfully');
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
    console.log({
      guest_session_id: global.cart_session_id,
    });
    callNonTokenApi(config.apiName.bindAutheticatedUser, 'POST', {
      guest_session_id: global.cart_session_id,
    })
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          // console.log('i am called');
          // completeCart();
        } else {
          Alert.alert('Error!', res.message);
        }
      })
      .catch(err => {
        dispatch(setLoader(false));
        console.log('i am called', err);
        console.log(err.response);
      });
  };

  return (
    <View style={styles.content}>
      {page && (
        <View style={styles.contentTopView}>
          <View style={styles.wrapper}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.pageHeading}>Login</Text>
          </View>
        </View>
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
          <Spacer />
          <Spacer />
          <Input
            label={'Email'}
            placeholder={'olivia@untitledui.com'}
            left={mail}
            isSecure={false}
            value={email}
            setValue={setEmail}
          />
          <Spacer />
          <Input
            label={'Password'}
            placeholder={'********'}
            left={lock}
            right={eye}
            isSecure={true}
            value={password}
            setValue={setPassword}
          />
          <Spacer />

          <MyButton
            label={'Login'}
            txtColor={COLORS.white}
            icon={userSimple}
            iconPosition={'right'}
            btnColor={COLORS.secondary}
            onPress={loginWithEmail}
          />
          <MyButton
            label={
              <Text style={styles.loginBtnTxt}>
                Not a member?{' '}
                <Text style={styles.loginBtnTxtInner}>Signup</Text>
              </Text>
            }
            txtColor={COLORS.black}
            btnColor={COLORS.white}
            borderColor={COLORS.black}
            onPress={() => {
              RootNavigation.navigate('Register');
            }}
          />

          <MyButton
            label={'Continue with Google'}
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

export default LoginForm;
