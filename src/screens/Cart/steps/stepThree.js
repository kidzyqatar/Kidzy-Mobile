import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  MasterLayout,
  BackBar,
  Phrase,
  Spacer,
  Hr,
  MyButton,
  Chip,
  Heading,
  Input,
  PrefixTextInput,
} from '@components';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import globalStyles from '@constants/global-styles';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  checkedRadio,
  uncheckedRadio,
  checked as checkedCheckbox,
  unchecked as uncheckedCheckbox,
  addCircle,
  calendar,
  clock,
  mouse,
  minus,
  plus,
  balloon,
} from '@constants/icons';
import {styles} from '../styles';
import Checkbox from '../../../components/Checkbox/Checkbox';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {formatDate} from '../../../helpers/helper';
import {useDispatch, useSelector} from 'react-redux';
import {Dimensions} from 'react-native';

const {height: screenHeight} = Dimensions.get('window');
import {
  callNonTokenApi,
  callNonTokenApiAddress,
} from '../../../helpers/ApiRequest';
import config from '../../../constants/config';
import {
  setBallonsCount,
  setCart,
  setCartCalculations,
  setLoader,
  setSameAsBillingAddress,
  setSelectedBillingAddress,
  setSelectedCharacter,
  setSelectedDeliveryDate,
  setSelectedDeliveryTime,
  setSelectedShippingAddress,
  setSendtoFriend,
  setFriendAddress,
} from '../../../store/reducers/global';
import {TextInput} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useIsFocused} from '@react-navigation/native';
import {getJSONData, storeJSONData} from '../../../helpers/AsyncStorage';

const SendToFriendAddressInput = React.memo(({ 
  refRBSheetFriendAddress, 
  t, 
  s_firstName, 
  s_setFirstName,
  s_lastName, 
  s_setLastName,
  s_mobileNumber, 
  s_setMobileNumber,
  s_street, 
  s_setStreet,
  s_city, 
  s_setCity,
  s_province, 
  s_setProvince,
  addShippingAddress,
  styles,
  globalStyles,
  COLORS,
  SIZES
}) => {
  return (
    <RBSheet
      ref={refRBSheetFriendAddress}
      closeOnDragDown={true}
      closeOnPressMask={false}
      dragFromTopOnly={true}
      height={670}
      minClosingHeight={0}
      keyboardAvoidingViewEnabled={true}
      animationType="slide"
      customStyles={{
        wrapper: {
          backgroundColor: COLORS.bottomSheetBackground,
        },
        draggableIcon: {
          backgroundColor: '#000',
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }
      }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, paddingBottom: 50}}
        nestedScrollEnabled={true}>
        <View
          style={[
            globalStyles.contentContainer,
            {marginHorizontal: SIZES.radius, paddingBottom: 30},
          ]}>
          <Heading
            txt={t('addNewAddress')}
            txtStyle={styles.bSheetTopHeading}
          />
          <Spacer />
          <>
            <Spacer />
            <Input
              label={t(`recipientFirstName`)}
              placeholder={t('firstName')}
              value={s_firstName}
              setValue={s_setFirstName}
            />
            <Spacer />
            <Input
              label={t('recipientLastName')}
              placeholder={t('lastName')}
              value={s_lastName}
              setValue={s_setLastName}
            />
            <Spacer />
            <PrefixTextInput
              label={t('mobileNumber')}
              placeholder={'000-000-000'}
              prefix={'+974'}
              value={s_mobileNumber}
              maxLength={9}
              setValue={s_setMobileNumber}
            />
            <Spacer />
            <Input
              label={t('street')}
              placeholder={t('pleaseProvideStreetAddress')}
              value={s_street}
              setValue={s_setStreet}
            />
            <Spacer />
            <View style={styles.cvvView}>
              <View style={styles.halfInput}>
                <Input
                  label={t('city')}
                  placeholder={t('exampleAlWakra')}
                  value={s_city}
                  setValue={s_setCity}
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label={t('stateProvinceArea')}
                  placeholder={t('exampleDoha')}
                  value={s_province}
                  setValue={s_setProvince}
                />
              </View>
            </View>
            <Spacer />
            <Spacer />
          </>
          <View style={[styles.bSheetBottom, {justifyContent: 'center'}]}>
            <MyButton
              label={t('addAddress')}
              txtColor={COLORS.white}
              btnColor={COLORS.secondary}
              borderColor={COLORS.secondary}
              onPress={addShippingAddress}
            />
          </View>
        </View>
      </ScrollView>
    </RBSheet>
  );
});

const StepThree = ({incrementBallonQuantity, decrementBallonQuantity}) => {
  const {t} = useTranslation();
  const global = useSelector(state => state.global);
  const dispatch = useDispatch();

  const refRBSheet = useRef();
  const refRBSheetFriendAddress = useRef();
  const refRBSheetTimings = useRef();
  const refRBSheetBalloon = useRef();
  const isFocused = useIsFocused();
  const [sameAsBilling, setSameAsBilling] = useState(false);

  const [calcDate, setCalcDate] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  const [character, setCharacter] = useState();

  const [openDate, setOpenDate] = useState(false);

  // New state for available characters
  const [availableCharacters, setAvailableCharacters] = useState([]);

  // Function to permanently book a character for a specific date/time
  const storeCharacterBooking = async (characterId, date, time) => {
    try {
      const timeValue = typeof time === 'object' ? time.value : time;
      const bookingKey = `${characterId}_${date}_${timeValue}`;
      
      // Get existing bookings
      const existingBookings = await getJSONData('character_bookings') || {};
      
      // Add new booking
      existingBookings[bookingKey] = true;
      
      // Store updated bookings
      await storeJSONData('character_bookings', existingBookings);
      
      console.log(`Character ${characterId} permanently booked for ${date} at ${timeValue}`);
    } catch (error) {
      console.log('Error storing character booking:', error);
    }
  };

  // Function to get available characters with persistent booking check
  const getAvailableCharacters = async () => {
    if (global.cart_delivery_date && global.cart_delivery_time) {
      const timeValue = typeof global.cart_delivery_time === 'object'
        ? global.cart_delivery_time.value
        : global.cart_delivery_time;

      callNonTokenApi(
        `${config.apiName.getCharacters}/available?date=${global.cart_delivery_date}&time=${timeValue}`,
        'GET'
      )
        .then(res => {
          if (res.status === 200) {
            setAvailableCharacters(res.data.characters);
          }
        })
        .catch(async error => {
          console.log('Characters availability endpoint not found, using fallback logic');
          // Fallback: Filter characters based on persistent booking data
          if (global.allCharacters && global.allCharacters.length > 0) {
            // Get stored bookings from AsyncStorage
            const storedBookings = await getJSONData('character_bookings') || {};
            
            const availableChars = global.allCharacters.filter(character => {
              // Create unique booking key for this character, date, and time
              const bookingKey = `${character.id}_${global.cart_delivery_date}_${timeValue}`;
              
              // Check if this character is permanently booked for this date/time
              const isPermanentlyBooked = storedBookings[bookingKey] === true;
              
              // Also check current cart items for immediate bookings
              const isCurrentlyBooked = global?.cart?.order_items?.some(item => {
                const itemDeliveryDate = item.delivery_date || global.cart_delivery_date;
                const itemDeliveryTime = typeof item.delivery_time === 'object' 
                  ? item.delivery_time.value 
                  : item.delivery_time || (typeof global.cart_delivery_time === 'object' 
                    ? global.cart_delivery_time.value 
                    : global.cart_delivery_time);
                
                return item.character_id === character.id && 
                       itemDeliveryDate === global.cart_delivery_date && 
                       itemDeliveryTime === timeValue;
              });
              
              return !isPermanentlyBooked && !isCurrentlyBooked;
            });
            
            setAvailableCharacters(availableChars);
          }
        });
    }
  };
  //billing
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [defaultShipping, setDefaultShipping] = useState(1);
  const [defaultBilling, setDefaultBilling] = useState(1);

  //shipping
  const [s_firstName, s_setFirstName] = useState('');
  const [s_lastName, s_setLastName] = useState('');
  const [s_mobileNumber, s_setMobileNumber] = useState('');
  const [s_street, s_setStreet] = useState('');
  const [s_city, s_setCity] = useState('');
  const [s_province, s_setProvince] = useState('');

  // Memoize all setter functions to prevent recreation
const memoizedSetFirstName = React.useCallback((value) => s_setFirstName(value), []);
const memoizedSetLastName = React.useCallback((value) => s_setLastName(value), []);
const memoizedSetMobileNumber = React.useCallback((value) => s_setMobileNumber(value), []);
const memoizedSetStreet = React.useCallback((value) => s_setStreet(value), []);
const memoizedSetCity = React.useCallback((value) => s_setCity(value), []);
const memoizedSetProvince = React.useCallback((value) => s_setProvince(value), []);

// Fix the memoized function - remove circular dependency
const memoizedAddShippingAddress = React.useCallback(() => {
  addShippingAddress();
}, [s_firstName, s_lastName, s_mobileNumber, s_street, s_city, s_province, defaultShipping, defaultBilling]);

  const [addresses, setAddresses] = useState(null);
  const [quantityBalloon, setQuantityBalloon] = useState(0);

  const [deliveryTimes, setDeliveryTimes] = useState([]);
  // Add initialization useEffect to sync local state with global state
  useEffect(() => {
    if (isFocused) {
      // Initialize local state from global state if it exists
      if (global.cart_delivery_date) {
        setDeliveryDate(global.cart_delivery_date);
        // Also set the calcDate for the DatePicker
        setCalcDate(new Date(global.cart_delivery_date));
      }
      if (global.cart_delivery_time) {
        setDeliveryTime(global.cart_delivery_time);
      }
      getTimeSlotsCapacity();
    }
  }, [isFocused]);

  // Keep the time clearing effect but only when date changes
  useEffect(() => {
    if (global?.cart_delivery_date) {
      // Only clear time when date changes, not on focus
      dispatch(setSelectedDeliveryTime(''));
      setDeliveryTime('');
      getTimeSlotsCapacity();
    }
  }, [global?.cart_delivery_date]);
  // Add this new useEffect to call getAvailableCharacters when date changes
  useEffect(() => {
    if (global.cart_delivery_date && global.cart_delivery_time) {
      getAvailableCharacters();
    }
  }, [global.cart_delivery_date]);
  // Add this new useEffect to call getAvailableCharacters when time changes
  useEffect(() => {
    if (global.cart_delivery_date && global.cart_delivery_time) {
      getAvailableCharacters();
    }
  }, [global.cart_delivery_time]);

  useEffect(() => {
    if (isFocused) {
      getAddresses();
      // If friend address exists in Redux, set it as selected shipping address
      if (global.cart_friend_address && !sameAsBilling) {
        dispatch(setSelectedShippingAddress(global.cart_friend_address));
      }
    }
  }, [isFocused]);
  console.log(deliveryTimes, 'deliveryTimes');
  useEffect(() => {
    if (!sameAsBilling) {
      // Sending to a friend
      if (global.cart_friend_address) {
        dispatch(setSelectedShippingAddress(global.cart_friend_address));
      } else {
        // No friend address yet — clear selection to force validation
        dispatch(setSelectedShippingAddress(null));
      }
    } else {
      // Same as billing
      dispatch(setSelectedShippingAddress(global.cart_billing_address));
    }
    // cart_is_sent_to_friend should be true when NOT same as billing
    dispatch(setSendtoFriend(!sameAsBilling));
  }, [sameAsBilling, global.cart_friend_address, global.cart_billing_address]);

  console.log("sameAsBilling", sameAsBilling);

  const toggleSameAsBillingAddress = () => {
    setSameAsBilling(!sameAsBilling);
    dispatch(setSameAsBillingAddress(!sameAsBilling));
    dispatch(setSendtoFriend(sameAsBilling));
  };

  // Local state for characters with availability status
  const [characters, setCharacters] = useState([]);

  // Add this useEffect to merge available characters with all characters
  useEffect(() => {
    if (global.allCharacters) {
      if (availableCharacters.length > 0) {
        // Create a map of available character IDs for quick lookup
        const availableIds = new Set(availableCharacters.map(char => char.id));
        // Update the characters array with availability status
        const updatedCharacters = global.allCharacters.map(character => ({
          ...character,
          available: availableIds.has(character.id)
        }));
        setCharacters(updatedCharacters);
      } else {
        // If no available characters, mark all as unavailable
        const updatedCharacters = global.allCharacters.map(character => ({
          ...character,
          available: false
        }));
        setCharacters(updatedCharacters);
      }
    }
  }, [availableCharacters, global.allCharacters]);

  const addShippingAddress = async () => {
  console.log('🚀 addShippingAddress function called');
  console.log('📋 Form values:', {
    firstName: s_firstName,
    lastName: s_lastName,
    mobileNumber: s_mobileNumber,
    street: s_street,
    city: s_city,
    province: s_province,
    defaultShipping,
    defaultBilling
  });
  console.log('🌐 Global state:', {
    cart_session_id: global.cart_session_id,
    isLoggedIn: global.isLoggedIn,
    user_id: global.user?.id,
    cart_id: global.cart?.id
  });

  // Validation checks with detailed logging
  if (!s_firstName || s_firstName.trim() === '') {
    console.log('❌ Validation failed: First name is required');
    Alert.alert('Error!', 'First name is required');
    return;
  }
  if (!s_lastName || s_lastName.trim() === '') {
    console.log('❌ Validation failed: Last name is required');
    Alert.alert('Error!', 'Last name is required');
    return;
  }
  if (!s_mobileNumber || s_mobileNumber.trim() === '') {
    console.log('❌ Validation failed: Mobile number is required');
    Alert.alert('Error!', 'Mobile number is required');
    return;
  }
  if (s_mobileNumber.length < 8) {
    console.log('❌ Validation failed: Mobile number too short:', s_mobileNumber.length);
    Alert.alert('Error!', 'Mobile number should be at least 10 digits');
    return;
  }
  if (!s_street || s_street.trim() === '') {
    console.log('❌ Validation failed: Street is required');
    Alert.alert('Error!', 'Street is required');
    return;
  }
  if (!s_city || s_city.trim() === '') {
    console.log('❌ Validation failed: City is required');
    Alert.alert('Error!', 'City is required');
    return;
  }
  if (!s_province || s_province.trim() === '') {
    console.log('❌ Validation failed: Province is required');
    Alert.alert('Error!', 'Province is required');
    return;
  }

  // Check cart session ID
  if (!global.cart_session_id) {
    console.log('❌ Critical error: cart_session_id is missing');
    Alert.alert('Error!', 'Cart session not found. Please refresh and try again.');
    return;
  }

  console.log('✅ All validations passed, proceeding with API call');

  try {
    // Remove this line - it closes the form too early
    // refRBSheet.current.close();
    
    const response = await callNonTokenApiAddress(
      config.apiName.addAddress,
      'POST',
      {
        guest_session_id: global.cart_session_id,
        first_name: s_firstName.trim(),
        last_name: s_lastName.trim(),
        mobile_number: s_mobileNumber.trim(),
        street: s_street.trim(),
        city: s_city.trim(),
        state: s_province.trim(),
        is_default_billing: defaultBilling === 1,
        is_default_shipping: defaultShipping === 1,
        // If logged in, add user_id
        ...(global.isLoggedIn && global.user?.id ? { user_id: global.user.id } : {})
      }
    );

    console.log('📡 API Response received:', {
      status: response?.status,
      message: response?.message,
      data: response?.data
    });
    
    dispatch(setLoader(false));
    
    if (response?.status === 200) {
      console.log('✅ Address added successfully');
      
      // Clear form fields using correct state setters
      s_setFirstName('');
      s_setLastName('');
      s_setMobileNumber('');
      s_setStreet('');
      s_setCity('');
      s_setProvince('');
      setDefaultShipping(0);
      setDefaultBilling(0);
      
      console.log('🏠 Setting selected shipping address:', response.data.address);
      // Validate address exists in response before using it
      if (response.data && response.data.address && response.data.address.id) {
        // Save friend address to Redux locally
        dispatch(setFriendAddress(response.data.address));
        dispatch(setSelectedShippingAddress(response.data.address));
        
        console.log('🛒 Calling addShippingAddressToCart with address ID:', response.data.address.id);
        await addShippingAddressToCart(response.data.address);
      } else {
        console.error('❌ Shipping address response is invalid:', response.data);
        Alert.alert(t('error'), t('addressNotCreated') || 'Shipping address was not created properly. Please try again.');
      }
      
      console.log('🔄 Refreshing addresses list');
      getAddresses();
      
      // Close the friend address form AFTER successful completion
      refRBSheetFriendAddress.current.close();
      
      console.log('🎉 Shipping address process completed successfully');
    } else {
      console.log('❌ API returned error status:', response?.status);
      console.log('❌ Error message:', response?.message);
      Alert.alert('Error!', response?.message || 'Failed to add address');
    }
  } catch (error) {
    console.log('💥 Exception caught in addShippingAddress:', error);
    console.log('💥 Error details:', {
      message: error.message,
      stack: error.stack
    });
    dispatch(setLoader(false));
    Alert.alert('Error!', 'An unexpected error occurred. Please try again.');
  }
};
  const hasCategory10OutDoor = () => {
    return global?.cart?.order_items.some(item =>
      item?.product?.categories?.some(category => category == '10'),
    );
  };
  const hasCategory15Party = () => {
    return global?.cart?.order_items.some(item =>
      item?.product?.categories?.some(category => category == '15'),
    );
  };
  const addShippingAddressToCart = async address => {
    // Validate address exists before proceeding
    if (!address || !address.id) {
      console.error('❌ Cannot add shipping address to cart: address is missing or invalid', address);
      return; // Silently return - don't show alert for shipping address
    }

    // Validate cart exists
    if (!global.cart || !global.cart.id) {
      console.error('❌ Cannot add shipping address to cart: cart is missing or invalid');
      return;
    }

    dispatch(setLoader(true));
    callNonTokenApi(config.apiName.addAddressToCart, 'POST', {
      address_id: address.id,
      order_id: global.cart.id,
      type: 'shipping',
    })
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          console.log('✅ Shipping address added to cart:', res.data);
        } else {
          Alert.alert(t('error'), res.message || t('somethingWentWrong'));
        }
      })
      .catch(err => {
      Alert.alert('Error', 'Error while binding shipping Address');
      dispatch(setLoader(false));
      console.log(err);
    });
};
  const to12Hour = timeStr => {
    const date = new Date(`1970-01-01T${convertTo24(timeStr)}Z`);
    return date
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC',
      })
      .toLowerCase();
  };
  const convertTo24 = timeStr => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    if (modifier.toLowerCase() === 'pm' && hours !== 12) {
      hours += 12;
    }
    if (modifier.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }
    return `${String(hours).padStart(2, '0')}:${minutes}:00`;
  };
  function convertTimeSlotFormat(slots) {
    return slots.map(slot => {
      const startLabel = to12Hour(slot.start_time);
      const endLabel = to12Hour(slot.end_time);
      const endValue = convertTo24(slot.end_time);

      return {
        label: `${startLabel} - ${endLabel}`,
        value: endValue,
      };
    });
  }

  const getTimeSlotsCapacity = () => {
    callNonTokenApi(
      global?.cart_delivery_date
        ? `${config.apiName.getTimeSlots}/available?date=${global?.cart_delivery_date}`
        : `${config.apiName.getTimeSlots}`,
      'GET',
    )
      .then(res => {
        if (res.status == 200) {
          console.log(
            res.timeslots,
            'slots',
            convertTimeSlotFormat(res.timeslots ?? []),
          );
          let data = convertTimeSlotFormat(res.timeslots ?? []);
          setDeliveryTimes(data);
          dispatch(setSelectedDeliveryTime(''));
          setDeliveryTime('');
        } else {
          Alert.alert('Error!', res.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const addAddress = async () => {
    refRBSheet.current.close();
    let params = {
      guest_session_id: global.cart_session_id,
      first_name: firstName,
      last_name: lastName,
      mobile_number: mobileNumber,
      street: street,
      city: city,
      state: province,
      is_default_billing: true,
      is_default_shipping: true,
    };
    if (global.isLoggedIn && global.user?.id) {
      params['user_id'] = global.user.id;
    }
    dispatch(setLoader(true));
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
          
          // Validate address exists in response before using it
          if (res.data && res.data.address && res.data.address.id) {
            dispatch(setSelectedBillingAddress(res.data.address));
            addAddressToCart(res.data.address);
          } else {
            console.error('❌ Address response is invalid:', res.data);
            Alert.alert(t('error'), t('addressNotCreated') || 'Address was not created properly. Please try again.');
          }
          getAddresses();
        } else {
          Alert.alert(t('error'), res.message || t('somethingWentWrong'));
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
          const {addresses} = res.data;
          setAddresses(res.data.addresses || []);

          // Only process addresses if array exists and has items
          if (addresses && Array.isArray(addresses) && addresses.length > 0) {
            if (!global.cart_billing_address) {
              const selectedBilling =
                addresses.find(x => x.is_default_billing == true) || addresses[0];
              
              // Only set and add if valid address found
              if (selectedBilling && selectedBilling.id) {
                dispatch(setSelectedBillingAddress(selectedBilling));
                addAddressToCart(selectedBilling);
              }
            }

            if (!global.cart_shipping_address) {
              const selectedShipping =
                addresses.find(x => x.is_default_shipping == true) ||
                addresses[0];
              
              // Only set and add if valid address found
              if (selectedShipping && selectedShipping.id) {
                dispatch(setSelectedShippingAddress(selectedShipping));
                addShippingAddressToCart(selectedShipping);
              }
            }
          } else {
            console.log('ℹ️ No addresses found for user');
            // Don't show error - user just hasn't added addresses yet
          }
        } else {
          Alert.alert(t('error'), res.message || t('somethingWentWrong'));
        }
      })
      .catch(err => {
        dispatch(setLoader(false));
      });
  };

  const addAddressToCart = async address => {
    // Validate address exists before proceeding
    if (!address || !address.id) {
      console.error('❌ Cannot add address to cart: address is missing or invalid', address);
      Alert.alert(
        t('error'),
        t('addressRequired') || 'Please add an address before continuing'
      );
      return;
    }

    // Validate cart exists
    if (!global.cart || !global.cart.id) {
      console.error('❌ Cannot add address to cart: cart is missing or invalid');
      Alert.alert(
        t('error'),
        t('cartNotFound') || 'Cart not found. Please try again'
      );
      return;
    }

    dispatch(setLoader(true));

    callNonTokenApi(config.apiName.addAddressToCart, 'POST', {
      address_id: address.id,
      order_id: global.cart.id,
      type: 'billing',
    })
      .then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          console.log('✅ Billing address added to cart:', res.data);
        } else {
          Alert.alert(t('error'), res.message || t('somethingWentWrong'));
        }
      })
      .catch(err => {
        dispatch(setLoader(false));
        console.error('❌ Error adding billing address to cart:', err);
        Alert.alert(t('error'), t('somethingWentWrong'));
      });
  };

  const incrementQuantity = () => {
    setQuantityBalloon(quantityBalloon + 1);
    dispatch(setBallonsCount(quantityBalloon + 1));

    incrementBallonQuantity(quantityBalloon + 1);
  };

  const decrementQuantity = () => {
    if (quantityBalloon > 0) {
      setQuantityBalloon(quantityBalloon - 1);
      dispatch(setBallonsCount(quantityBalloon - 1));
      decrementBallonQuantity(quantityBalloon + 1);
    } else {
      refRBSheetBalloon.current.open();
    }
    dispatch(setCart(global.cart));
  };

  const BillingAddresses = () => {
    return (
      <ScrollView>
        {addresses && addresses.map((item, index) => (
          <View key={item.id || index} style={[styles.addressContainer]}>
            <View
              style={[
                globalStyles.row,
                globalStyles.alignCenter,
                {alignItems: 'flex-start'},
              ]}>
              <View style={{width: SIZES.ten}}>
                <TouchableOpacity
                  onPress={() => {
                    if (item && item.id) {
                      dispatch(setSelectedBillingAddress(item));
                      addAddressToCart(item);
                    } else {
                      console.error('❌ Invalid address item selected:', item);
                      Alert.alert(t('error'), t('invalidAddress') || 'Invalid address selected');
                    }
                  }}>
                  <Image
                    source={
                      global.cart_billing_address?.id === item.id
                        ? checkedRadio
                        : uncheckedRadio
                    }
                    style={styles.checkbox}
                  />
                </TouchableOpacity>
              </View>
              <View style={{width: SIZES.ninty}}>
                <View style={globalStyles.row}>
                  <Phrase txt={'Home: '} txtStyle={styles.addressNameTitle} />
                  {item.is_default_billing ? (
                    <Chip
                      status={'Default'}
                      bgColor={COLORS.secondary + '1A'}
                      txtColor={COLORS.secondary}
                    />
                  ) : null}
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
        ))}
      </ScrollView>
    );
  };

  // console.log(">>>>>>>>>>> address",JSON.stringify(addresses,null,4))

  const ShippingAddresses = () => {
    // Only show friend address if it exists in Redux
    const friendAddress = global.cart_friend_address;
    
    if (!friendAddress) {
      return null; // Don't show anything if no friend address exists
    }

    return (
      <ScrollView>
        <View key={friendAddress.id} style={[styles.addressContainer]}>
          <View
            style={[
              globalStyles.row,
              globalStyles.alignCenter,
              {alignItems: 'flex-start'},
            ]}>
            <View style={{width: SIZES.ten}}>
              <TouchableOpacity
                onPress={() => {
                  if (friendAddress && friendAddress.id) {
                    dispatch(setSelectedShippingAddress(friendAddress));
                    addShippingAddressToCart(friendAddress);
                  } else {
                    console.error('❌ Invalid shipping address item selected:', friendAddress);
                    Alert.alert(t('error'), t('invalidAddress') || 'Invalid address selected');
                  }
                }}>
                <Image
                  source={
                    global.cart_shipping_address?.id === friendAddress.id
                      ? checkedRadio
                      : uncheckedRadio
                  }
                  style={styles.checkbox}
                />
              </TouchableOpacity>
            </View>
            <View style={{width: SIZES.ninty}}>
              <View style={globalStyles.row}>
                <Phrase txt={'Home: '} txtStyle={styles.addressNameTitle} />
              </View>

              <Phrase
                txt={`${friendAddress.first_name} ${friendAddress.last_name}, ${friendAddress.street}, ${friendAddress.city}, ${friendAddress.state}`}
                txtStyle={styles.addressName}
              />
              <Phrase
                txt={`${friendAddress.mobile_number}`}
                txtStyle={styles.addressName}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };



  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 100}}>
      <Spacer />
      {/* Address Section */}
      <View style={[globalStyles.whiteBg, globalStyles.contentContainer]}>
        <Phrase
          txt={t('pleaseChooseBillingAddress')}
          txtStyle={{...FONTS.body5_bold}}
        />
        <Spacer />
        <BillingAddresses />
        <Spacer />
        <MyButton
          label={t('addNewAddress')}
          txtColor={COLORS.secondary}
          btnColor={COLORS.secondaryLite}
          borderColor={COLORS.secondaryLite}
          btnStyle={{width: SIZES.fifty}}
          icon={addCircle}
          onPress={() => refRBSheet.current.open()}
        />
      </View>
      {/* Address Section */}
      <Spacer />
      {/* Send to Friend Section */}
      <View style={[globalStyles.whiteBg, globalStyles.contentContainer]}>
        <Phrase
          txt={t('pleaseChooseShippingAddress')}
          txtStyle={{...FONTS.body5_bold}}
        />
        <Spacer />
        <Checkbox
          state={sameAsBilling}
          stateChanger={toggleSameAsBillingAddress}
          label={t('sameAsBillingAddress')}/>
        <Spacer />
        <Checkbox
          state={!sameAsBilling}
          stateChanger={toggleSameAsBillingAddress}
          label={t('sendingItToAFriend')}
        />
        {!sameAsBilling ? (
          <>
            <Spacer />
             <ShippingAddresses />
            <MyButton
              label={t('addNewAddress')}
              txtColor={COLORS.secondary}
              btnColor={COLORS.secondaryLite}
              borderColor={COLORS.secondaryLite}
              btnStyle={{width: SIZES.fifty}}
              icon={addCircle}
              onPress={() => refRBSheetFriendAddress.current.open()}
            />
            <SendToFriendAddressInput 
              refRBSheetFriendAddress={refRBSheetFriendAddress}
              t={t}
              s_firstName={s_firstName}
              s_setFirstName={memoizedSetFirstName}
              s_lastName={s_lastName}
              s_setLastName={memoizedSetLastName}
              s_mobileNumber={s_mobileNumber}
              s_setMobileNumber={memoizedSetMobileNumber}
              s_street={s_street}
              s_setStreet={memoizedSetStreet}
              s_city={s_city}
              s_setCity={memoizedSetCity}
              s_province={s_province}
              s_setProvince={memoizedSetProvince}
              addShippingAddress={memoizedAddShippingAddress}
              styles={styles}
              globalStyles={globalStyles}
              COLORS={COLORS}
              SIZES={SIZES}
            />
          </>
        ) : null}
      </View>

      {/* Send to Friend Section */}
      <Spacer />
      {/* Timing Section */}
      {!hasCategory10OutDoor() && (
        <View style={[globalStyles.whiteBg, globalStyles.contentContainer]}>
          <Phrase
            txt={t('deliveryDateAndTime')}
            txtStyle={{...FONTS.body5_bold}}
          />
          <Spacer />
          <View>
            <TouchableOpacity
              onPress={() => setOpenDate(true)}
              style={{
                ...StyleSheet.absoluteFill,
                zIndex: 3,
              }}
            />

            <Input
              label={t('chooseDeliveryDate')}
              placeholder={t('selectDate')}
              value={deliveryDate}
              right={calendar}
              customStyle={{zIndex: 1}}
            />
          </View>
          <Spacer />
          {!hasCategory15Party() && (
            <View>
              <TouchableOpacity
                onPress={() => {
                  refRBSheetTimings.current.open();
                }}
                style={{
                  ...StyleSheet.absoluteFill,
                  zIndex: 3,
                }}
              />
              <Input
                label={t('chooseDeliveryTime')}
                placeholder={t('selectTime')}
                value={deliveryTime.label}
                setValue={setDeliveryTime}
                right={clock}
                customStyle={{zIndex: 1}}
              />
            </View>
          )}
        </View>
      )}

      {/* Timing Section */}
      <Spacer />
      {/* Special delivery section */}
      {!hasCategory10OutDoor() && (
      <View style={[globalStyles.whiteBg, globalStyles.contentContainer]}>
        <Phrase
          txt={t('specialInstructionsOptional')}
          txtStyle={{...FONTS.body5_bold}}
        />
        <Phrase
          txt={t('specialInstructionsText')}
          txtStyle={{
            marginVertical: SIZES.radius,
            ...FONTS.body6,
            color: COLORS.txtGray,
          }}
        />
        <Spacer />

        <ScrollView horizontal={true} scrollEnabled={true}>
          {characters && characters.map(item => (
            <View key={item.id} style={{alignItems: 'center'}}>
              <TouchableOpacity
                style={[
                  styles.character,
                  {
                    borderWidth: character == item.id ? 3 : 1,
                    borderColor:
                      character == item.id ? COLORS.secondary : COLORS.grayBg,
                    opacity: item.available ? 1 : 0.5,
                  },
                ]}
                onPress={async () => {
                  if (item.available) {
                    setCharacter(item.id);
                    dispatch(setSelectedCharacter(item));
                    // Store the booking permanently when character is selected
                    await storeCharacterBooking(
                      item.id,
                      global.cart_delivery_date,
                      global.cart_delivery_time
                    );
                  } else {
                    Alert.alert('Unavailable', 'This character is not available for the selected date and time.');
                  }
                }}>
                <Image
                  source={{uri: item.full_image}}
                  style={[
                    styles.characterImg,
                    {opacity: item.available ? 1 : 0.5}
                  ]}
                />
                {!item.available && (
                  <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: 10,
                  }}>
                    <Text style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 12,
                      textAlign: 'center'
                    }}>Not Available</Text>
                  </View>
                )}
              </TouchableOpacity>
              <Phrase
                txt={`QAR ${item.price}`}
                txtStyle={{
                  ...FONTS.body5_bold,
                  color:
                    character == item.id ? COLORS.secondary : COLORS.txtGray,
                  opacity: item.available ? 1 : 0.5,
                }}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      )}
      {/* Special delivery section */}
      <Spacer />
      {/* Special balloons section */}
      <View style={[globalStyles.whiteBg, globalStyles.contentContainer]}>
        <Phrase
          txt={t('addBalloonsOptional')}
          txtStyle={{...FONTS.body5_bold}}
        />
        <Phrase
          txt={t('addBalloonsText')}
          txtStyle={{
            marginVertical: SIZES.radius,
            ...FONTS.body6,
            color: COLORS.txtGray,
          }}
        />
        <Spacer />
        <View style={styles.balloonSectionContainer}>
          <Phrase txt={t('quantity')} txtStyle={{...FONTS.body4}} />
          <View style={styles.calcView}>
            <TouchableOpacity
            style={{padding:16,}}
              onPress={() => {
                decrementQuantity();
              }}>
              <Image source={minus} style={styles.calcImg} />
            </TouchableOpacity>
            <Phrase txt={quantityBalloon} txtStyle={styles.calcTxt} />
            <TouchableOpacity
             style={{padding:16}}
              onPress={() => {
                incrementQuantity();
              }}>
              <Image source={plus} style={styles.calcImg} />
            </TouchableOpacity>
          </View>
          <Phrase
            txt={`QAR ${global.balloon_charges}`}
            txtStyle={{...FONTS.body4_bold, color: COLORS.secondary}}
          />
        </View>
      </View>
      {/* Special balloons section */}

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={740}
        minClosingHeight={0}
        customStyles={{
          wrapper: {
            backgroundColor: COLORS.bottomSheetBackground,
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
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
          {/* {<AddressForm />} */}
          <>
            <Spacer />
            <Input
              label={t('firstName')}
              placeholder={t('firstName')}
              // value={firstName}
              setValue={setFirstName}
            />
            <Spacer />
            <Input
              label={t('lastName')}
              placeholder={t('lastName')}
              // value={lastName}
              setValue={setLastName}
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
            <Input
              label={t('street')}
              placeholder={t('pleaseProvideStreetAddress')}
              value={street}
              setValue={setStreet}
            />
            <Spacer />

            <View style={styles.cvvView}>
              <View style={styles.halfInput}>
                <Input
                  label={t('city')}
                  placeholder={t('exampleAlWakra')}
                  value={city}
                  setValue={setCity}
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label={t('stateProvinceArea')}
                  placeholder={t('exampleDoha')}
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
              label={t('markAsDefaultBillingAddress')}
            />
            <Spacer />
            <Checkbox
              state={defaultShipping}
              stateChanger={setDefaultShipping}
              label={t('markAsDefaultShippingAddress')}
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
      </RBSheet>
      <DatePicker
        modal
        open={openDate}
        date={calcDate}
        mode={'date'}
        minimumDate={new Date()}
        maximumDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
        onConfirm={date => {
          setOpenDate(false);
          setCalcDate(date);
          const value = moment(date).format('YYYY-MM-DD');
          setDeliveryDate(value);
          dispatch(setSelectedDeliveryDate(value));
          console.log(deliveryDate, global.cart_delivery_date);
          // Call getAvailableCharacters if time is already selected
          if (global.cart_delivery_time) {
            getAvailableCharacters();
          }
        }}
        onCancel={() => {
          setOpenDate(false);
        }}
      />

      <RBSheet
        ref={refRBSheetTimings}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={screenHeight * 0.6} // 60% of screen height
        minClosingHeight={0}
        customStyles={{
          wrapper: {
            backgroundColor: COLORS.bottomSheetBackground,
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
          container: {
            paddingHorizontal: SIZES.padding,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <Phrase
          txt={'Select Delivery Time Slot'}
          txtStyle={{
            ...FONTS.body4_bold,
            marginBottom: SIZES.padding,
            marginTop: SIZES.padding,
          }}
        />

        <ScrollView
          style={{maxHeight: screenHeight * 0.4}} // max height for scroll area
          contentContainerStyle={{paddingBottom: 20}}
          showsVerticalScrollIndicator={false}>
          {deliveryTimes?.map((element, index) => (
            <TouchableOpacity
              key={index.toString()}
              style={{width: '100%', height: 40, justifyContent: 'center'}}
              onPress={() => {
                setDeliveryTime(element);
                dispatch(setSelectedDeliveryTime(element.value));
                // Call getAvailableCharacters if date is already selected
                if (global.cart_delivery_date) {
                  setTimeout(() => getAvailableCharacters(), 100);
                }
              }}>
              <Phrase
                txt={element.label}
                txtStyle={{
                  ...FONTS.body4_medium,
                  color:
                    deliveryTime.label === element.label
                      ? COLORS.secondary
                      : COLORS.txtGray,
                }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.bSheetBottom, {justifyContent: 'center'}]}>
          <MyButton
            label={'Save'}
            txtColor={COLORS.white}
            btnColor={COLORS.secondary}
            borderColor={COLORS.secondary}
            onPress={() => {
              dispatch(setSelectedDeliveryTime(deliveryTime));
              refRBSheetTimings.current.close();
              // Call getAvailableCharacters after setting time
              if (global.cart_delivery_date) {
                setTimeout(() => getAvailableCharacters(), 100);
              }
            }}
          />
        </View>
      </RBSheet>

      <RBSheet
        ref={refRBSheetBalloon}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={350}
        minClosingHeight={0}
        customStyles={{
          wrapper: {
            backgroundColor: COLORS.bottomSheetBackground,
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
          container: {paddingHorizontal: SIZES.radius},
        }}>
        <View>
          <Image
            source={balloon}
            style={{width: 100, height: 100, resizeMode: 'contain'}}
          />
          <Phrase
            txt={t('notAddingBalloons')}
            txtStyle={{...FONTS.body4_bold, marginBottom: SIZES.radius}}
          />
          <Phrase
            txt={t('notAddingBalloonsText')}
            txtStyle={{
              ...FONTS.body6,
              marginBottom: SIZES.radius,
              color: COLORS.txtGray,
            }}
          />
          <MyButton
            label={t('noWait')}
            txtColor={COLORS.white}
            btnColor={COLORS.secondary}
            borderColor={COLORS.secondary}
            onPress={() => refRBSheetBalloon.current.close()}
          />
          <MyButton
            label={t('skip')}
            txtColor={COLORS.black}
            btnColor={COLORS.white}
            borderColor={COLORS.black}
            onPress={() => refRBSheetBalloon.current.close()}
          />
        </View>
      </RBSheet>
    </ScrollView>
  );
};

export default StepThree;
