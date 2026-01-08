import {View, Text, Image, StyleSheet, Alert, ScrollView} from 'react-native';
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

import {setCart, setLoader, setGuestEmail, setGuestMobile} from '../../store/reducers/global';
import {useDispatch, useSelector} from 'react-redux';
import {setCartSessionID} from '../../store/reducers/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';

const GuestForm = ({closeForm, page = true, completeCart}) => {
  const {t} = useTranslation();
  const global = useSelector(state => state.global);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Mobile number validation function
  const isValidMobile = (mobile) => {
    // Remove spaces and dashes, check if it's at least 8 digits
    const cleanMobile = mobile.replace(/[\s-]/g, '');
    return cleanMobile.length >= 8 && /^\d+$/.test(cleanMobile);
  };

  return (
    <View style={styles.content}>
      <Spacer />
      <Spacer />
      <View
        style={[
          styles.contentMiddleView,
          {height: page ? SIZES.seventy : SIZES.hundred},
        ]}>
        <ScrollView
          
          keyboardShouldPersistTaps={'handled'}
        
          showsVerticalScrollIndicator={false}>
          <Input
            label={t('email')}
            placeholder={'olivia@untitledui.com'}
            left={mail}
            isSecure={false}
            value={email}
            setValue={setEmail}
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
          <MyButton
            label={t('continue')}
            txtColor={COLORS.white}
            icon={forwardArrowWhite}
            iconPosition={'right'}
            btnColor={COLORS.secondary}
            iconColor={COLORS.white}
            onPress={() => {
              // Proper validation logic
              const trimmedEmail = email.trim();
              const trimmedMobile = mobileNumber.trim();
              
              // Check if email is provided and valid
              if (!trimmedEmail) {
                Alert.alert('Validation Error', 'Please enter your email address.');
                return;
              }
              
              if (!isValidEmail(trimmedEmail)) {
                Alert.alert('Validation Error', 'Please enter a valid email address.');
                return;
              }
              
              // Check if mobile number is provided and valid
              if (!trimmedMobile) {
                Alert.alert('Validation Error', 'Please enter your mobile number.');
                return;
              }
              
              if (!isValidMobile(trimmedMobile)) {
                Alert.alert('Validation Error', 'Please enter a valid mobile number (at least 8 digits).');
                return;
              }
              
              // Check cart session
              if (!global.cart_session_id) {
                Alert.alert('Error', 'Cart session expired. Please add items to cart again.');
                return;
              }
              
              dispatch(setLoader(true));
              
              // Store guest info in global state before API call
              dispatch(setGuestEmail(trimmedEmail));
              dispatch(setGuestMobile(trimmedMobile));
              
              callNonTokenApi(config.apiName.bindGuestUser, 'POST', {
                guest_session_id: global.cart_session_id,
                guest_email: trimmedEmail,
                guest_mobile_number: trimmedMobile,
              })
                .then(res => {
                  dispatch(setLoader(false));
                  console.log('✅ Guest binding successful:', res.data);
                  if (res.status == 200) {
                    console.log('Guest binding successful');
                    closeForm();
                  } else {
                    Alert.alert('Error!', res.message);
                  }
                })
                .catch(err => {
                  dispatch(setLoader(false));
                  console.log('❌ Guest binding failed:');
                  console.log('Error details:', err.response?.data);
                  console.log('Status code:', err.response?.status);
                  console.log('Cart session ID:', global.cart_session_id);
                  
                  if (err.response?.status === 500) {
                    Alert.alert(
                      'Cart Session Expired',
                      'Your cart session has expired. Please add items to your cart again.',
                      [
                        {
                          text: 'OK',
                          onPress: () => {
                            closeForm();
                          }
                        }
                      ]
                    );
                  } else {
                    Alert.alert('Error', 'Something went wrong. Please try again.');
                  }
                });
            }}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default GuestForm;
