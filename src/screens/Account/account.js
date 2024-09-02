import React, {useEffect, useRef, useState} from 'react';
import {Alert, Image, TouchableOpacity, View} from 'react-native';
import {Avatar} from 'react-native-paper';
import {avatar} from '@constants/images';
import {
  myOrders,
  myWallet,
  myPaymentInformation,
  myAddress,
  myUser,
  back,
  logo,
} from '@constants/icons';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import {MasterLayout, Phrase, Spacer, Hr, MyButton} from '@components';
// import { chevron, , mail, lock, eye, userSimple } from '@constants/icons';
import globalStyles from '@constants/global-styles';
import {styles} from './styles';
import * as RootNavigation from '../../navigators/RootNavigation';
import {useDispatch, useSelector} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import {LoginForm, RegisterForm} from '../../components';
import {
  setActiveTab,
  setIsLoggedIn,
  setLoader,
  setUser,
} from '../../store/reducers/global';
import {getData} from '../../helpers/AsyncStorage';
import {callNonTokenApi} from '../../helpers/ApiRequest';
import config from '../../constants/config';
import ActivityIndicatorOverlay from '../../components/ActivityIndicator/ActivityIndicatorOverlay';
import {useTranslation} from 'react-i18next';

export default function Account() {
  const {t} = useTranslation();
  const global = useSelector(state => state.global);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(global.user);
  const [form, setForm] = useState(0);
  const [authSheetHeight, setAuthSheetHeight] = useState(600);
  const authSheet = useRef();

  const closeAuthSheet = () => {
    authSheet.current.close();
    setProfile(global.user);
  };

  const closeAuthSheetAndError = message => {
    authSheet.current.close();

    // Alert.alert('Error', message)
  };

  useEffect(() => {
    console.log('Called in Profile');
  }, [profile]);

  const logoutUser = async () => {
    // dispatch(setIsLoggedIn(false))
    // RootNavigation.navigate('Home')
    // dispatch(setActiveTab(0));
    // return
    dispatch(setLoader(true));
    const token = await getData('access_token');
    console.log(token, 'token ');
    if (token !== '') {
      callNonTokenApi(config.apiName.logoutUser, 'POST')
        .then(res => {
          console.log(res);

          dispatch(setUser(null));
          setProfile(null);
          dispatch(setIsLoggedIn(false));

          dispatch(setActiveTab(0));
          RootNavigation.navigate('Home');
          dispatch(setLoader(false));
        })
        .catch(err => {
          console.log(err);
          dispatch(setLoader(false));
        });
    }
  };

  const completeCart = async () => {
    console.log('profile', 'token ');
    dispatch(setLoader(true));
    const token = await getData('access_token');
    console.log(token, 'token ');
    if (token !== '') {
      callNonTokenApi(config.apiName.getProfile, 'GET')
        .then(res => {
          dispatch(setLoader(false));
          if (res.status == 200) {
            closeAuthSheet();
            console.log(res.data);
            dispatch(setUser(res.data));
            setProfile(res.data);
            dispatch(setLoader(false));
          } else {
            Alert.alert('Error!', res.meesage);
          }
        })
        .catch(err => {
          dispatch(setLoader(false));
        });
    }
  };
  return (
    <MasterLayout bgColor={COLORS.bgGray} scrolling={false} max={true}>
      {profile === null ? (
        <>
          <View
            style={{
              flex: 1,
              justifyContent: 'center', // Center vertically
              alignItems: 'center',
              padding: SIZES.padding,
            }}>
            <Phrase
              txt={t('pleaseSignInToContinue')}
              txtStyle={styles.toolTxt}
            />

            <MyButton
              label={t('login')}
              txtColor={COLORS.white}
              btnColor={COLORS.secondary}
              borderColor={COLORS.grayLight}
              onPress={() => {
                authSheet.current.open();
              }}
            />
          </View>
          <RBSheet
            ref={authSheet}
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
              container: {
                height: authSheetHeight,
                paddingHorizontal: SIZES.radius,
              },
            }}>
            {global.loader ? (
              <ActivityIndicatorOverlay visible={true} />
            ) : (
              // <View />
              <>
                <View style={{}}>
                  <Image source={logo} style={styles.logo} />
                  <View style={styles.pillsContainerLogin}>
                    <TouchableOpacity
                      style={[
                        styles.pillBtnLogin,
                        {
                          width: SIZES.fourtyFive,
                          backgroundColor:
                            form == 0 ? COLORS.secondary : 'transparent',
                        },
                      ]}
                      onPress={() => {
                        setForm(0);
                        setAuthSheetHeight(600);
                      }}>
                      <Phrase
                        txt={'Login'}
                        txtStyle={{
                          color: form == 0 ? COLORS.white : COLORS.black,
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.pillBtnLogin,
                        {
                          width: SIZES.fourtyFive,
                          backgroundColor:
                            form == 1 ? COLORS.secondary : 'transparent',
                        },
                      ]}
                      onPress={() => {
                        setForm(1);
                        setAuthSheetHeight(700);
                      }}>
                      <Phrase
                        txt={'Register'}
                        txtStyle={{
                          color: form == 1 ? COLORS.white : COLORS.black,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {form == 0 && (
                  <LoginForm
                    closeForm={closeAuthSheetAndError}
                    page={false}
                    completeCart={completeCart}
                  />
                )}
                {form == 1 && (
                  <RegisterForm
                    closeForm={closeAuthSheetAndError}
                    page={false}
                    completeCart={completeCart}
                  />
                )}
              </>
            )}
          </RBSheet>
        </>
      ) : (
        <>
          <View style={styles.topRow}>
            <View style={styles.topRowLeftView}>
              <Avatar.Image
                size={70}
                source={{uri: profile.full_image}}
                style={styles.topImg}
              />
            </View>
            <View style={styles.topRowRightView}>
              <Phrase
                txt={`${profile.name} ${profile.last_name}`}
                txtStyle={styles.topRowName}
              />
              <Phrase txt={profile.email} txtStyle={styles.topRowEmail} />
            </View>
          </View>

          <Spacer />
          <Spacer />
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={[globalStyles.rowView, styles.listItem]}
              onPress={() => {
                RootNavigation.navigate('Orders');
              }}>
              <View style={styles.listItemLeftView}>
                <Image source={myOrders} style={styles.toolImg} />
                <Phrase txt={t('myOrders')} txtStyle={styles.toolTxt} />
              </View>
              <View style={styles.listItemRightView}>
                <Image source={back} style={styles.forwardImg} />
              </View>
            </TouchableOpacity>

            <Spacer />
            <TouchableOpacity
              style={[globalStyles.rowView, styles.listItem]}
              onPress={() => {
                RootNavigation.navigate('Wallet');
              }}>
              <View style={styles.listItemLeftView}>
                <Image source={myWallet} style={styles.toolImg} />
                <Phrase txt={t('wallet')} txtStyle={styles.toolTxt} />
              </View>
              <View style={styles.listItemRightView}>
                <Image source={back} style={styles.forwardImg} />
              </View>
            </TouchableOpacity>

            <Spacer />
            <TouchableOpacity
              style={[globalStyles.rowView, styles.listItem]}
              onPress={() => {
                RootNavigation.navigate('PaymentInformation');
              }}>
              <View style={styles.listItemLeftView}>
                <Image source={myPaymentInformation} style={styles.toolImg} />
                <Phrase
                  txt={t('paymentInformation')}
                  txtStyle={styles.toolTxt}
                />
              </View>
              <View style={styles.listItemRightView}>
                <Image source={back} style={styles.forwardImg} />
              </View>
            </TouchableOpacity>

            <Spacer />
            <TouchableOpacity
              style={[globalStyles.rowView, styles.listItem]}
              onPress={() => {
                RootNavigation.navigate('Address');
              }}>
              <View style={styles.listItemLeftView}>
                <Image source={myAddress} style={styles.toolImg} />
                <Phrase txt={t('addresses')} txtStyle={styles.toolTxt} />
              </View>
              <View style={styles.listItemRightView}>
                <Image source={back} style={styles.forwardImg} />
              </View>
            </TouchableOpacity>

            <Spacer />
            <TouchableOpacity
              style={[globalStyles.rowView, styles.listItem]}
              onPress={() => {
                RootNavigation.navigate('Profile');
              }}>
              <View style={styles.listItemLeftView}>
                <Image source={myUser} style={styles.toolImg} />
                <Phrase
                  txt={t('accountAndSecurity')}
                  txtStyle={styles.toolTxt}
                />
              </View>
              <View style={styles.listItemRightView}>
                <Image source={back} style={styles.forwardImg} />
              </View>
            </TouchableOpacity>

            <Hr />
            <Spacer />
            <TouchableOpacity>
              <Phrase
                txt={t('aboutTheAppV1.0')}
                txtStyle={{...FONTS.body4, color: COLORS.txtGray}}
              />
            </TouchableOpacity>
            <Spacer />
            <TouchableOpacity>
              <Phrase
                txt={t('privacyPolicy')}
                txtStyle={{...FONTS.body4, color: COLORS.txtGray}}
              />
            </TouchableOpacity>
            <Spacer />
            <TouchableOpacity>
              <Phrase
                txt={t('termsAndConditions')}
                txtStyle={{...FONTS.body4, color: COLORS.txtGray}}
              />
            </TouchableOpacity>
            <Spacer />

            <MyButton
              label={t('logOut')}
              txtColor={COLORS.black}
              btnColor={COLORS.white}
              borderColor={COLORS.grayLight}
              onPress={logoutUser}
            />
          </View>
        </>
      )}
    </MasterLayout>
  );
}
