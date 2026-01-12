import React, {useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {COLORS, SIZES, FONTS} from '@constants/theme';
import {btnCart} from '@constants/icons';
import {Phrase, MyButton} from '@components';
import * as RootNavigation from '@navigators/RootNavigation';
import {callNonTokenApi} from '../../helpers/ApiRequest';
import config from '../../constants/config';
import {useDispatch, useSelector} from 'react-redux';
import {setCartSessionID, setCart} from '../../store/reducers/global';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductWidget = ({item}) => {
  const {t} = useTranslation();
  const {width: screenWidth} = useWindowDimensions();
  const global = useSelector(state => state.global);
  const dispatch = useDispatch();
  
  // Add loading state to prevent multiple API calls
  const [isLoading, setIsLoading] = useState(false);
  const [apiFailModal, setApiFailModal] = useState(false);

  // Check if this product is already in the cart
  const isInCart =
    global?.cart?.order_items?.some(
      cartItem =>
        cartItem.product_id === item.id ||
        cartItem.product?.id === item.id,
    ) || false;

  const addItemTocart = async () => {
    // If already in cart, just show a message and don't add again
    if (isInCart) {
      Alert.alert(
        t('added'),
        t('productAlreadyInCart') || 'This product is already in your cart.',
      );
      return;
    }
    console.log("call add to cart")
    if (isLoading) return;
    
    setIsLoading(true);
    const timestamp = Date.now();
    
    try {
      // Use global cart session ID or create/sync a new one
      let guestSessionId = global.cart_session_id;
      
      if (!guestSessionId) {
        console.log("Check AsyncStorage first")
        // Check AsyncStorage first
        guestSessionId = await AsyncStorage.getItem('guest_session_id');
        
        if (!guestSessionId) {
          // Create new session ID
          guestSessionId = `guest_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
          await AsyncStorage.setItem('guest_session_id', guestSessionId);
        }
        
        // Sync to Redux store
        dispatch(setCartSessionID(guestSessionId));
      }
      
      const payload = {
        product_id: item.id,
        guest_session_id: guestSessionId,
        quantity: 1,
      };
      
      console.log(`📦 Request payload:`, payload);
      console.log(`📡 [${timestamp}] Making API call`);
      
      const response = await callNonTokenApi(
        config.apiName.addToCart,
        'POST',
        payload,
      );
      
      console.log(`✅ [${timestamp}] API call successful:`, response);
      
      if (response?.status === 200) {
        // After successful add, refresh the cart to get updated items
        const cartResponse = await callNonTokenApi(
          `${config.apiName.getCart}/${guestSessionId}`,
          'GET',
        );
        
        if (cartResponse?.status === 200) {
          dispatch(setCart(cartResponse.data.cart));
          console.log(`🛒 Cart refreshed successfully`);
          console.log(
            `📊 Cart items:`,
            cartResponse.data.cart?.order_items?.length || 0,
          );
        }
      } else {
        // Non-200 response from add-to-cart
        Alert.alert(
          t('error'),
          response?.message || t('failedToAddToCart'),
        );
      }
    } catch (error) {
      console.log(`❌ Add to cart error:`, error);
      console.log('📄 Error response:', error.response?.data);
      console.log('🔢 Error status:', error.response?.status);
      console.log('📋 Error headers:', error.response?.headers);
      
      if (error.response?.status === 422) {
        console.log('🚨 Validation Error - Backend rejected the request');
        console.log('💡 Possible issues: missing fields, invalid data, or business rules');
      }
      
      Alert.alert(
        t('error'),
        error.response?.data?.message ||
          t('failedToAddToCart') ||
          error.message,
      );
    } finally {
      setIsLoading(false);
      console.log(`🏁 [${timestamp}] Resetting loading state`);
    }
  };

  // Fallback placeholder image when full_image is missing
  const placeholderImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHTecWVG03Q76l1-z24nS61GOBn9Rq-7DSkw&s';
  const imageSource = item.full_image && item.full_image.trim() !== '' 
    ? {uri: item.full_image} 
    : {uri: placeholderImage};

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.container,
          {width: screenWidth * 0.5 - SIZES.radius * 3},
        ]}
        onPress={() => {
          RootNavigation.navigate('ProductDetail', {item: item});
        }}>
        <Image 
          source={imageSource} 
          style={styles.productImg}
          onError={(e) => console.log('Image load error:', item.name, e.nativeEvent.error)}
        />
        <View style={styles.contentContainer}>
          <Phrase
            txt={item.name}
            txtStyle={styles.productTitle}
            numberOfLines={2}
          />
          <View style={styles.priceContainer}>
            {item.before_discount_price ? (
              <Phrase
                txt={`QAR ${item.before_discount_price}`}
                txtStyle={styles.productOldPrice}
                crossed
              />
            ) : (
              <View style={styles.priceSpacerPlaceholder} />
            )}
            <Phrase txt={`QAR ${item.price}`} txtStyle={styles.productPrice} />
          </View>
          <MyButton
            label={
              <Text style={styles.productBtn}>
                {isInCart ? t('added') : t('addToCart')}
              </Text>
            }
            btnStyle={[
              styles.btnStyle,
              (isLoading || isInCart) && {opacity: 0.6},
            ]}
            txtColor={COLORS.secondary}
            btnColor={COLORS.cartBtn}
            borderColor={COLORS.black}
            icon={btnCart}
            iconPosition={'right'}
            onPress={addItemTocart}
            disabled={isLoading}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.grayLight1,
    borderRadius: SIZES.base,
    marginRight: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    marginVertical: SIZES.base,
    height: 340, // Fixed height for consistent cards
  },
  productImg: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  contentContainer: {
    padding: SIZES.radius,
    flex: 1,
    justifyContent: 'space-between',
  },
  productTitle: {
    color: COLORS.black,
    ...FONTS.body5,
    height: 44, // Fixed height for 2 lines
    lineHeight: 22,
  },
  priceContainer: {
    height: 58, // Fixed height for price section
    justifyContent: 'flex-end',
  },
  priceSpacerPlaceholder: {
    height: 22, // Same height as old price text
  },
  productPrice: {
    color: COLORS.black,
    ...FONTS.body3_bold,
  },
  productOldPrice: {
    color: COLORS.gray,
    ...FONTS.body6,
    textDecorationLine: 'line-through',
  },
  productBtn: {
    ...FONTS.body5_bold,
  },
  btnStyle: {
    borderWidth: 0,
    height: 40,
  },
});

export default ProductWidget;
