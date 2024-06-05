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
  forwardArrowWhite,
} from '@constants/icons';
import styles from './styles';
import {Input, Spacer, MyButton, PrefixTextInput} from '@components';
import {COLORS, FONTS, SIZES} from '@constants/theme';
import * as RootNavigation from '@navigators/RootNavigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {callNonTokenApi} from '../../helpers/ApiRequest';
import config from '../../constants/config';

import {setCart, setLoader} from '../../store/reducers/global';
import {useDispatch, useSelector} from 'react-redux';
import {setCartSessionID} from '../../store/reducers/global';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GuestForm = ({closeForm, page = true, completeCart}) => {
  const global = useSelector(state => state.global);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  return (
    <View style={styles.content}>
      <Spacer />
      <Spacer />
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
            label={'Email'}
            placeholder={'olivia@untitledui.com'}
            left={mail}
            isSecure={false}
            value={email}
            setValue={setEmail}
          />
          <Spacer />
          <PrefixTextInput
            label={'Mobile Number'}
            placeholder={'000-000-000'}
            prefix={'+974'}
            value={mobileNumber}
            setValue={setMobileNumber}
          />
          <Spacer />
          <MyButton
            label={'Continue'}
            txtColor={COLORS.white}
            icon={forwardArrowWhite}
            iconPosition={'right'}
            btnColor={COLORS.secondary}
            iconColor={COLORS.white}
            onPress={() => {
              console.log('i am called', email != null);
              if (email == null) {
                return;
              }
              console.log('i am called');
              if (setMobileNumber == null) {
                return;
              }
              console.log('i am called');
              dispatch(setLoader(true));
              callNonTokenApi(config.apiName.bindGuestUser, 'POST', {
                guest_session_id: global.cart_session_id,
                guest_email: email,
                guest_mobile_number: mobileNumber,
              })
                .then(res => {
                  dispatch(setLoader(false));
                  console.log('i am called');
                  if (res.status == 200) {
                    // completeCart()
                  } else {
                    Alert.alert('Error!', res.message);
                  }
                })
                .catch(err => {
                  dispatch(setLoader(false));
                  console.log('i am called');
                  console.log(err);
                });
            }}
          />
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default GuestForm;
