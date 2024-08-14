import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  MasterLayout,
  BackBar,
  Phrase,
  Spacer,
  Hr,
  MyButton,
  OrderItem,
  Chip,
  Heading,
  Input,
  DiscountWidget,
  CartItem,
  TotalWidget,
  LoginForm,
  RegisterForm,
  GuestForm,
} from '@components';
import {product1, product2, product3} from '@constants/images';
import {chevron, logo, mail, lock, eye, userSimple} from '@constants/icons';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import globalStyles from '@constants/global-styles';
import {styles} from './styles';
import RBSheet from 'react-native-raw-bottom-sheet';
import StepOne from '@screens/Cart/steps/stepOne';
import StepTwo from '@screens/Cart/steps/stepTwo';
import StepThree from './steps/stepThree';
import StepFour from './steps/stepFour';
import StepFive from './steps/stepFive';
import {useDispatch, useSelector} from 'react-redux';
import {cart, discount} from '../../constants/icons';
import {callNonTokenApi} from '../../helpers/ApiRequest';
import config from '../../constants/config';
import {
  setCart,
  setCartCalculations,
  setLoader,
  setCartSessionID,
  setSelectedBillingAddress,
  setSelectedShippingAddress,
  setBallonsCount,
  setSelectedCharacter,
  setSelectedDeliveryDate,
  setSelectedDeliveryTime,
  setSameAsBillingAddress,
  setSentToFriend,
} from '../../store/reducers/global';
import ActivityIndicatorOverlay from '../../components/ActivityIndicator/ActivityIndicatorOverlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '@navigators/RootNavigation';
import {useTranslation} from 'react-i18next';

const MyCart = () => {
  const {t} = useTranslation();
  const global = useSelector(state => state.global);
  const dispatch = useDispatch();
  const [userCart, setUserCart] = useState(global.cart);
  const refRBSheet = useRef();
  const authSheet = useRef();
  const [expandDiscount, setExpandDiscount] = useState(false);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('My Cart');
  const [form, setForm] = useState(0);
  const [authSheetHeight, setAuthSheetHeight] = useState(600);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [calculations, setCalculations] = useState({
    subtotal: 0,
    wrapper: 0,
    specialDelivery: 0,
    balloons: 0,
    shipping: 0,
    discount: 0,
    grandTotal: 0,
  });
  const handleDiscountExtend = () => setExpandDiscount(!expandDiscount);
  const applyCoupon = async coupon => {
    dispatch(setLoader(true));
    callNonTokenApi(config.apiName.applyCoupon, 'POST', {
      coupon: coupon,
      order_id: global.cart.id,
    })
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          console.log('coupon', res);
          getCart();
        } else {
          Alert.alert('Error!', res.message);
        }
      })
      .catch(err => {
        dispatch(setLoader(false));
        console.log('error', err);
      });
  };
  const removeCoupon = async () => {
    dispatch(setLoader(true));
    console.log('I am called');
    callNonTokenApi(config.apiName.removeCoupon, 'POST', {
      order_id: global.cart.id,
    })
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          getCart();
        } else {
          Alert.alert('Error!', res.message);
        }
      })
      .catch(err => {
        dispatch(setLoader(false));
        console.log('error', err);
      });
  };

  const getCart = () => {
    dispatch(setLoader(true));
    callNonTokenApi(
      `${config.apiName.getCart}/${global.cart_session_id}`,
      'GET',
    )
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          console.log(res.data.cart?.order_items?.length);
          dispatch(setCart(res.data.cart));
        } else {
          Alert.alert('Error!', res.message);
        }
      })
      .catch(error => {
        dispatch(setLoader(false));
        console.log(error);
        setApiFailModal(true);
      });
  };

  const completeCart = async () => {
    dispatch(setLoader(true));
    console.log('i am called here', global.cart_calculation);
    callNonTokenApi(config.apiName.completeCart, 'POST', {
      order_id: global.cart.id,

      character_id:
        global.cart_character === null ? null : global.cart_character?.id,
      // "wrapper_id": 1,//Confusing
      subtotal: global.cart_calculation.subtotal,
      discount: global.cart_calculation.discount,
      tax: global.tax,
      shipping_cost: global.shipping_charges,
      special_delivery_cost: global.cart_calculation.specialDelivery,
      balloon_cost: global.cart_ballons_count * global.balloon_charges,
      wrapper_cost: global.cart_calculation.wrapper,
      grand_total: global.cart_calculation.grandTotal,
      delivery_date: global.cart_delivery_date,
      delivery_time: global.cart_delivery_time.value,
      status: 'PROCESSING',
    })
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          console.log(res.data);
          closeAuthSheet();
          dispatch(setCart(null));
          dispatch(setSelectedShippingAddress(null));
          dispatch(setSelectedBillingAddress(null));
          dispatch(setBallonsCount(0));
          dispatch(setSelectedCharacter(null));
          dispatch(setSelectedDeliveryDate(''));
          dispatch(setSelectedDeliveryTime(''));
          dispatch(setSameAsBillingAddress(false));
          dispatch(setSentToFriend(false));

          RootNavigation.navigate('Thankyou');
        } else {
          Alert.alert('Error!', res.message);
        }
      })
      .catch(err => {
        dispatch(setLoader(false));
        Alert.alert('Error', 'Something Went Wrong please try again.');
      });
  };

  const closeAuthSheet = () => {
    authSheet.current.close();
  };

  useEffect(() => {
    calculateTotal(0);
  }, [global.cart]);
  useEffect(() => {
    calculateTotal(0);
  }, [global.cart_ballons_count]);
  useEffect(() => {
    calculateTotal(0);
  }, [global.cart_ballons_count]);
  useEffect(() => {
    calculateTotal(0);
  }, [global.cart_character]);

  const calculateTotal = (ballons = 0) => {
    // userCart.
    console.log('i am called hererererere');
    var total = 0;
    var specialDelivery = 0;
    var wrapperIDs = [];
    var discount = 0;
    var ballonCharges = 0;
    setItems(global.cart?.order_items ?? []);
    global.cart?.order_items?.map((elem, index) => {
      total = elem.total_price + total;
      if (elem.details?.wrapper_id != null) {
        wrapperIDs.push(elem.details?.wrapper_id);
      }
    });
    specialDelivery = Number(global.cart_character?.price ?? 0);
    ballonCharges = Number(
      (global.balloon_charges ?? 0) * global.cart_ballons_count,
    );
    var grandSum =
      total +
      specialDelivery +
      wrapperIDs.length * 10 +
      ballonCharges +
      Number(global.shipping_charges) +
      Number(global.tax);
    console.log(global.cart?.coupon);

    if (global.cart?.coupon != null) {
      if (global.cart.coupon.amount) discount = global.cart.coupon.amount;

      if (global.cart.coupon.percentage) {
        const discountPercentage =
          grandSum * (global.cart?.coupon.percentage / 100);
        discount = global.cart.coupon.amount
          ? Math.min(discountPercentage, global.cart.coupon.amount)
          : discountPercentage;
      }
    }
    discount = Number(discount).toFixed(2);
    grandSum = Number(grandSum).toFixed(2);
    grandSum = grandSum - discount;

    setStep(step);
    setCalculations({
      ...calculations,
      subtotal: total,
      grandTotal: grandSum,
      specialDelivery: specialDelivery,
      wrapper: wrapperIDs.length * 10,
      discount: discount,
      balloons: ballonCharges,
      shipping: global.shipping_charges,
    });
    dispatch(setCartCalculations(calculations));
  };

  useEffect(() => {
    switch (step) {
      case 1:
        setTitle('My Cart');
        break;
      case 2:
        setTitle('Add Gift Wrapper');
        calculateTotal(0);
        break;
      case 3:
        setTitle('Address & Delivery');
        break;
      case 4:
        setTitle('Payment');
        break;
      case 5:
        setTitle('Confirmation');
        break;
      default:
        setTitle('My Cart');
        break;
    }
  }, [step]);

  const incrementBallonQuantity = quantity => {
    // console.log(quantity)
    // calculateTotal(quantity)
  };

  const decrementBallonQuantity = quantity => {
    // console.log(quantity)
    // calculateTotal(quantity)
  };

  const [items, setItems] = useState(global.cart?.order_items ?? []);

  const handleContinuePress = () => {
    switch (step) {
      case 1:
        if (global?.isLoggedIn) {
          setStep(2);
        } else {
          authSheet.current.open();
        }
        break;
      case 2:
        setStep(3);
        break;
      case 3:
        if (
          global.cart_is_same_as_billing &&
          global.cart_shipping_address == null
        ) {
          console.log('address is same as billing');
          dispatch(setSelectedShippingAddress(global.cart_billing_address));
          callNonTokenApi(config.apiName.addAddressToCart, 'POST', {
            address_id: global.cart_billing_address.id,
            order_id: global.cart.id,
            type: 'shipping',
          })
            .then(res => {
              dispatch(setLoader(false));
              if (res.status == 200) {
                console.log('Set Cart shipping address', res.data);
              } else {
                Alert.alert(
                  'Error',
                  'Error while binding shipping Address, Please Try Again',
                );
              }
            })
            .catch(err => {
              Alert.alert('Error', 'Error while binding shipping Address');
              dispatch(setLoader(false));
              console.log(err);
            });
        }
        console.log(global.cart_delivery_date, global.cart_delivery_time);
        if (
          global.cart_shipping_address == null ||
          global.cart_billing_address == null
        ) {
          Alert.alert(
            'Error',
            'Please make sure to add/select Shipping and billing Address.',
          );
        } else if (global.cart_delivery_date == '') {
          Alert.alert('Error', 'Please make sure to select Delivery Date.');
        } else if (global.cart_delivery_time == '') {
          Alert.alert('Error', 'Please make sure to select Delivery Time.');
        } else {
          setStep(4);
        }
        break;
      case 4:
        setStep(5);
        break;
      case 5:
        completeCart();
        break;
      default:
        break;
    }
  };

  const handleBackPress = () => {
    switch (step) {
      case 2:
        setStep(1);
        break;
      case 3:
        setStep(2);
        break;
      case 4:
        setStep(3);
        break;
      case 5:
        setStep(4);
        break;
      default:
        break;
    }
  };
  return (
    <MasterLayout bgColor={COLORS.bgGray} scrolling={false} max={true}>
      <View style={globalStyles.whiteBg}>
        {step == 1 ? (
          <BackBar
            title={t(title)}
            navigateTo={'Home'}
            right={step == 1 ? true : false}
          />
        ) : (
          <TouchableOpacity
            onPress={() => {
              handleBackPress();
            }}>
            <BackBar
              title={t(title)}
              navigateTo={'Home'}
              right={step == 1 ? true : false}
              showCaseView={true}
            />
          </TouchableOpacity>
        )}
      </View>
      <Spacer />

      {step == 1 && (
        <StepOne
          cart={global.cart}
          items={items}
          calculations={calculations}
          calculationsChanger={setCalculations}
          applyCoupon={applyCoupon}
          removeCoupon={removeCoupon}
          getCart={getCart}
        />
      )}
      {step == 2 && <StepTwo items={items} getCart={getCart} />}
      {step == 3 && (
        <StepThree
          incrementBallonQuantity={incrementBallonQuantity}
          decrementBallonQuantity={decrementBallonQuantity}
        />
      )}
      {step == 4 && <StepFour />}
      {step == 5 && (
        <StepFive items={items} step={step} stepChanger={setStep} />
      )}

      {/* Cart Trigger */}
      <Pressable
        style={[
          globalStyles.whiteBg,
          styles.cartTriggerView,
          styles.shadowContainer,
        ]}
        onPress={() => refRBSheet.current.open()}>
        <View style={[styles.triggerLeft]}>
          <Phrase txt={t('total')} txtStyle={styles.totalTxt} />
          <Phrase
            txt={`QAR ${calculations.grandTotal}`}
            txtStyle={styles.priceTxt}
          />
          <Image source={chevron} style={styles.chevron} />
        </View>
        <View style={styles.triggerRight}>
          <MyButton
            label={t('continue')}
            txtColor={COLORS.white}
            btnColor={COLORS.primary}
            borderColor={COLORS.primary}
            btnStyle={styles.continueBtn}
            onPress={() => {
              handleContinuePress();
            }}
          />
        </View>
      </Pressable>
      {/* Cart Trigger */}

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={420}
        minClosingHeight={0}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <TotalWidget calculations={calculations} />
      </RBSheet>

      <RBSheet
        ref={authSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={600}
        minClosingHeight={0}
        customStyles={{
          wrapper: {
            backgroundColor: COLORS.black,
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
              <View style={styles.pillsContainer}>
                <TouchableOpacity
                  style={[
                    styles.pillBtn,
                    {
                      width: SIZES.thirty,
                      backgroundColor:
                        form == 0 ? COLORS.secondary : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    setForm(0);
                    setAuthSheetHeight(600);
                  }}>
                  <Phrase
                    txt={t('login')}
                    txtStyle={{color: form == 0 ? COLORS.white : COLORS.black}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.pillBtn,
                    {
                      width: SIZES.thirty,
                      backgroundColor:
                        form == 1 ? COLORS.secondary : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    setForm(1);
                    setAuthSheetHeight(700);
                  }}>
                  <Phrase
                    txt={t('register')}
                    txtStyle={{color: form == 1 ? COLORS.white : COLORS.black}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.pillBtn,
                    {
                      width: SIZES.thirty,
                      backgroundColor:
                        form == 2 ? COLORS.secondary : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    setForm(2);
                    setAuthSheetHeight(600);
                  }}>
                  <Phrase
                    txt={t('guest')}
                    txtStyle={{color: form == 2 ? COLORS.white : COLORS.black}}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {form == 0 && (
              <LoginForm
                closeForm={closeAuthSheet}
                page={false}
                completeCart={completeCart}
              />
            )}
            {form == 1 && (
              <RegisterForm
                closeForm={closeAuthSheet}
                page={false}
                completeCart={completeCart}
              />
            )}
            {form == 2 && (
              <GuestForm
                closeForm={closeAuthSheet}
                page={false}
                completeCart={completeCart}
              />
            )}
          </>
        )}
      </RBSheet>
    </MasterLayout>
  );
};

export default MyCart;
