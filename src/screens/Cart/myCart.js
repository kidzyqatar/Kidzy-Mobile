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
  Modal,
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
import {chevron, logo, mail, lock, eye, userSimple, clock} from '@constants/icons';
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
  setSendtoFriend,
  clearGuestInfo, // Add this line
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
  const [outdoorNoticeVisible, setOutdoorNoticeVisible] = useState(false);

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
    try {
      dispatch(setLoader(true));
      
      console.log('🚀 Starting cart completion...');
      console.log('🔍 Current global.payment_method:', global.payment_method);
      console.log('🔍 Cart session ID:', global.cart_session_id);
      console.log('🔍 Cart ID:', global.cart?.id);
      
      // For online payments, complete cart first then initiate Dibsy payment
      if (global.payment_method === 'online') {
        console.log('✅ Completing cart first for online payment...');
        
        // Step 1: Complete cart with all order details (like web version)
        const completeCartPayload = {
          guest_session_id: global.cart_session_id,
          status: "PENDING",
          order_id: global.cart.id,
          subtotal: calculations.subtotal,
          discount: calculations.discount,
          shipping_cost: calculations.shipping,
          tax: (global.tax || 0).toString(),
          grand_total: calculations.grandTotal,
          special_delivery_cost: calculations.specialDelivery,
          balloon_cost: calculations.balloons,
          wrapper_cost: calculations.wrapper,
          delivery_date: global.cart_delivery_date,
          character_id: global.cart_character?.id || null,
          payment_method: "DIBSY",
          source: 'mobile_app',
        };
        
        console.log('🔍 Complete Cart Payload:', JSON.stringify(completeCartPayload, null, 2));
        
        // Call complete-cart API
        const completeResponse = await callNonTokenApi(config.apiName.completeCart, 'POST', completeCartPayload);
        
        console.log('🔍 Complete Cart Response:', completeResponse);
        
        if (completeResponse && completeResponse.status === 200) {
          console.log('✅ Cart completed successfully, now initiating Dibsy payment...');
          
          // Step 2: Call dibsy/initiate to get payment URL (send order_id and grand_total)
          const dibsyPayload = {
            order_id: global.cart.id,
            grand_total: Number(calculations.grandTotal).toFixed(2), // Add the payment amount
          };
          
          console.log('🔍 Dibsy Payload:', JSON.stringify(dibsyPayload, null, 2));
          
          const paymentResponse = await callNonTokenApi(config.apiName.onlinePayment, 'POST', dibsyPayload);
          
          console.log('🔍 Dibsy Payment Response:', paymentResponse);
          console.log('🔍 Payment URL:', paymentResponse?.payment_url);
          
          dispatch(setLoader(false));
          
          if (paymentResponse && paymentResponse.payment_url) {
            console.log('🚀 Navigating to DibsyPaymentScreen with URL:', paymentResponse.payment_url);
            
            // Navigate to Dibsy payment screen
            RootNavigation.navigate('DibsyPaymentScreen', { 
              paymentUrl: paymentResponse.payment_url,
              cartSessionId: global.cart_session_id,
              orderId: global.cart.id,
              calculations: {
                subtotal: calculations.subtotal,
                discount: calculations.discount,
                shipping: calculations.shipping,
                tax: global.tax || 0,
                grandTotal: calculations.grandTotal,
                specialDelivery: calculations.specialDelivery,
                balloons: calculations.balloons,
                wrapper: calculations.wrapper,
                delivery_date: global.cart_delivery_date,
                character_id: global.cart_character?.id || null,
              }
            });
            
            return;
          } else {
            console.log('❌ Failed to initiate Dibsy payment');
            console.log('❌ Reason: No payment URL in response');
            Alert.alert('Error', 'Unable to initiate Dibsy payment. Please try again.');
            return;
          }
        } else {
          console.log('❌ Failed to complete cart');
          Alert.alert('Error', 'Unable to complete cart. Please try again.');
          dispatch(setLoader(false));
          return;
        }
      } else {
        // For COD payments, complete cart directly
        const response = await callNonTokenApi(config.apiName.completeCart, 'POST', {
          guest_session_id: global.cart_session_id,
          payment_method: global.payment_method,
          status: 'PENDING',
          order_id: global.cart.id,
          source: 'mobile_app',
          // Fix: Use calculations values directly since they're already formatted strings
          subtotal: calculations.subtotal,
          discount: calculations.discount,
          shipping_cost: calculations.shipping,
          tax: (global.tax || 0).toString(),
          grand_total: calculations.grandTotal,
          special_delivery_cost: calculations.specialDelivery,
          balloon_cost: calculations.balloons,
          wrapper_cost: calculations.wrapper,
          delivery_date: global.cart_delivery_date,
          character_id: global.cart_character?.id || null,
        });
        
        dispatch(setLoader(false));
        
        // Fix: Check if response exists and has success indicators instead of status
        if (response && !response.error) {
          console.log('✅ Cart completion successful');
          
          // Reset cart state
          dispatch(setCart({}));
          dispatch(setCartSessionID(''));
          dispatch(clearGuestInfo()); // Clear guest info
          dispatch(setSelectedBillingAddress(null));
          dispatch(setSelectedShippingAddress(null));
          dispatch(setBallonsCount(0));
          dispatch(setSelectedCharacter(null));
          dispatch(setSelectedDeliveryDate(''));
          dispatch(setSelectedDeliveryTime(''));
          dispatch(setSameAsBillingAddress(false));
          dispatch(setSendtoFriend(false));
          
          // If Outdoor order, show delivery notice modal before navigating
          const isOutdoorOrder = global?.cart?.order_items?.some(item =>
            item?.product?.categories?.some(category => category == '10'),
          );

          if (isOutdoorOrder) {
            setOutdoorNoticeVisible(true);
          } else {
            closeAuthSheet();
            console.log('✅ Navigating to Thankyou page for COD payment');
            RootNavigation.navigate('Thankyou');
          }
          
        } else {
          const errorMessage = response?.message || 'Unable to complete your order. Please try again.';
          console.log('❌ Order completion failed:', errorMessage);
          Alert.alert('Order Failed', errorMessage);
        }
      } // ← ADD THIS MISSING CLOSING BRACE
    } catch (error) {
      dispatch(setLoader(false));
      console.log('💥 Order completion error:', error);
      console.log('💥 Error details:', JSON.stringify(error, null, 2));
      Alert.alert('Error', 'Something went wrong while placing your order. Please check your connection and try again.');
    }
  };

  const closeAuthSheet = () => {
    authSheet.current.close();
    // After guest login, navigate to step 2 (gift wrapper)
    setStep(2);
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
    // Add this check to prevent calculations on empty cart
    if (!global.cart?.order_items || global.cart.order_items.length === 0) {
      setCalculations({
        subtotal: '0.00',
        wrapper: '0.00',
        specialDelivery: '0.00',
        balloons: '0.00',
        shipping: '0.00',
        discount: '0.00',
        grandTotal: '0.00',
      });
      return;
    }

    var subtotal = 0;
    var wrapper = 0;
    var specialDelivery = 0;
    var ballonCharges = 0;
    var shipping = 0;
    var discount = 0;
    var grandTotal = 0;

    global.cart?.order_items?.forEach(item => {
      subtotal += parseFloat(item.total_price || 0);
      wrapper += parseFloat(item.wrapper_price || 0);
      specialDelivery += parseFloat(item.special_delivery_price || 0);
    });

    ballonCharges = (global.cart_ballons_count || 0) * 5;
    shipping = parseFloat(global.cart?.shipping_charges || 0);
    discount = parseFloat(global.cart?.discount_amount || 0);
    grandTotal = subtotal + wrapper + specialDelivery + ballonCharges + shipping - discount;

    setCalculations({
      subtotal: subtotal.toFixed(2),
      wrapper: wrapper.toFixed(2),
      specialDelivery: specialDelivery.toFixed(2),
      balloons: ballonCharges.toFixed(2),
      shipping: shipping.toFixed(2),
      discount: discount.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    });
  };

  // Add this function inside the MyCart component
  const getStep2Title = () => {
    const cartItems = global.cart?.order_items || [];
    
    if (cartItems.length === 0) {
      return t('Add Gift Wrapper'); // Default when cart is empty
    }
    
    // Check if all items are outdoor or cakes categories
    const allItemsAreOutdoorOrCakes = cartItems.every(item => {
      const isOutdoor = item?.product?.categories?.some(cat => cat == '10') || 
                       item?.product?.category_id == '10';
      const isCakes = item?.product?.categories?.some(cat => 
                       ['11', '12', '13', '14'].includes(cat)) || 
                     ['11', '12', '13', '14'].includes(item?.product?.category_id);
      return isOutdoor || isCakes;
    });

    // Return 'Add Gift Card' only when ALL items are outdoor/cakes
    // Otherwise return 'Add Gift Wrapper' (default for mixed carts or other products)
    return allItemsAreOutdoorOrCakes ? t('Add Gift Card') : t('Add Gift Wrapper');
  };

  useEffect(() => {
    switch (step) {
      case 1:
        setTitle(t('My Cart'));
        break;
      case 2:
        setTitle(getStep2Title());
        calculateTotal(0);
        break;
      case 3:
        setTitle(t('Address & Delivery'));
        break;
      case 4:
        setTitle(t('Payment'));
        break;
      case 5:
        setTitle(t('Confirmation'));
        break;
      default:
        setTitle(t('My Cart'));
        break;
    }
  }, [step, global.cart]); // Add global.cart as dependency to update when cart changes

  const incrementBallonQuantity = quantity => {
    // console.log(quantity)
    // calculateTotal(quantity)
  };

  const decrementBallonQuantity = quantity => {
    // console.log(quantity)
    // calculateTotal(quantity)
  };

  const [items, setItems] = useState(global.cart?.order_items ?? []);

// Add this useEffect to sync items with global cart changes
useEffect(() => {
  setItems(global.cart?.order_items ?? []);
}, [global.cart?.order_items]);

const handleContinuePress = () => {
    // Helper to detect Outdoor category (ID '10') in cart items
    const hasOutdoorCategory = () => {
      try {
        return global?.cart?.order_items?.some(item =>
          item?.product?.categories?.some(category => category == '10'),
        );
      } catch (e) {
        return false;
      }
    };
    
    // Helper to detect Party category (ID '15') in cart items
    const hasPartyCategory = () => {
      try {
        return global?.cart?.order_items?.some(item =>
          item?.product?.categories?.some(category => category == '15'),
        );
      } catch (e) {
        return false;
      }
    };

    switch (step) {
      case 1:
        // If Outdoor category, skip login/register/guest requirement
        if (hasOutdoorCategory()) {
          setStep(2);
        } else if (global?.isLoggedIn) {
          setStep(2);
        } else {
          // Check if guest has provided email and mobile
          if (!global.guest_email || !global.guest_mobile) {
            authSheet.current.open();
          } else {
            // Guest info already provided, proceed to next step
            setStep(2);
          }
        }
        break;
      case 2:
        setStep(3);
        break;
      case 3:
        if (
          global.cart_is_same_as_billing &&
          global.cart_shipping_address == null &&
          global.cart_billing_address &&
          global.cart_billing_address.id
        ) {
          console.log('address is same as billing');
          dispatch(setSelectedShippingAddress(global.cart_billing_address));
          
          // Validate cart exists before making API call
          if (!global.cart || !global.cart.id) {
            Alert.alert(
              t('error'),
              t('cartNotFound') || 'Cart not found. Please try again'
            );
            return;
          }

          callNonTokenApi(config.apiName.addAddressToCart, 'POST', {
            address_id: global.cart_billing_address.id,
            order_id: global.cart.id,
            type: 'shipping',
          })
            .then(res => {
              dispatch(setLoader(false));
              if (res.status == 200) {
                console.log('✅ Set Cart shipping address', res.data);
              } else {
                Alert.alert(
                  t('error'),
                  res.message || t('somethingWentWrong')
                );
              }
            })
            .catch(err => {
              dispatch(setLoader(false));
              console.error('❌ Error binding shipping address:', err);
              Alert.alert(
                t('error'),
                t('addressBindingError') || 'Error while binding shipping address. Please try again.'
              );
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
        } else {
          // For Outdoor or Party category, skip date/time requirement
          if (hasOutdoorCategory() || hasPartyCategory()) {
            setStep(4);
          } else {
            // For other categories, enforce date/time selection
            if (!global.cart_delivery_date) {
              Alert.alert('Error', 'Please make sure to select Delivery Date.');
              return; // Add return to prevent proceeding
            } else if (!global.cart_delivery_time) {
              Alert.alert('Error', 'Please make sure to select Delivery Time.');
              return; // Add return to prevent proceeding
            } else {
              setStep(4);
            }
          }
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
    <MasterLayout 
    bgColor={COLORS.bgGray} 
    scrolling={false} 
    max={true}
    statusBarColor={COLORS.white}
    statusBarStyle='dark-content'
    >
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
        <TotalWidget 
          calculations={calculations} 
          onCheckoutPress={handleContinuePress} 
        />
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
                page={true} 
                completeCart={completeCart} 
              />
            )}
          </>
        )}
      </RBSheet>
      {/* Outdoor Delivery Notice Modal */}
      <Modal
        visible={outdoorNoticeVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOutdoorNoticeVisible(false)}>
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: SIZES.radius,
        }}>
          <View style={{
            width: '90%',
            backgroundColor: COLORS.white,
            borderRadius: 16,
            paddingVertical: SIZES.padding,
            paddingHorizontal: SIZES.padding,
            alignItems: 'center',
          }}>
            <Image
              source={clock}
              style={{width: 56, height: 56, marginBottom: SIZES.radius}}
            />
            <Heading
              txt={'Delivery Notice'}
              txtStyle={{
                ...FONTS.body3_bold,
                color: COLORS.black,
                marginBottom: SIZES.base,
              }}
            />
            <Phrase
              txt={'Your order will be delivered within 2 days'}
              txtStyle={{
                ...FONTS.body5,
                color: COLORS.txtGray,
                textAlign: 'center',
                marginBottom: SIZES.padding,
              }}
            />
            <MyButton
              label={'OK'}
              txtColor={COLORS.white}
              btnColor={COLORS.secondary}
              borderColor={COLORS.secondary}
              btnStyle={{width: SIZES.fifty}}
              onPress={() => {
                setOutdoorNoticeVisible(false);
                closeAuthSheet();
                RootNavigation.navigate('Thankyou');
              }}
            />
          </View>
        </View>
      </Modal>
      {/* Outdoor Delivery Notice Modal */}
    </MasterLayout>
  );
};

export default MyCart;
