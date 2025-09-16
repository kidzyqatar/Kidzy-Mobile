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

  const addItemTocart = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const timestamp = Date.now();
    
    try {
      // Use global cart session ID or create/sync a new one
      let guestSessionId = global.cart_session_id;
      
      if (!guestSessionId) {
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
        'add-to-cart',
        'POST',
        payload
      );
      
      console.log(`✅ [${timestamp}] API call successful:`, response);
      
      if (response?.status === 200) {
        // After successful add, refresh the cart to get updated items
        const cartResponse = await callNonTokenApi(
          `get-cart/${guestSessionId}`,
          'GET'
        );
        
        if (cartResponse?.status === 200) {
          dispatch(setCart(cartResponse.data.cart));
          console.log(`🛒 Cart refreshed successfully`);
          console.log(`📊 Cart items:`, cartResponse.data.cart?.order_items?.length || 0);
        }
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
      
      Alert.alert('Error', `Failed to add item to cart: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
      console.log(`🏁 [${timestamp}] Resetting loading state`);
    }
  };

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
        <Image source={{uri: item.full_image}} style={styles.productImg} />
        <View style={{padding: SIZES.radius}}>
          <Phrase
            txt={item.name}
            txtStyle={styles.productTitle}
            numberOfLines={3}
          />
          {item.before_discount_price && (
            <Phrase
              txt={`QAR ${item.before_discount_price}`}
              txtStyle={styles.productOldPrice}
              crossed
            />
          )}
          <Phrase txt={`QAR ${item.price}`} txtStyle={styles.productPrice} />
          <MyButton
            label={<Text style={styles.productBtn}>{t('addToCart')}</Text>}
            btnStyle={[styles.btnStyle, isLoading && {opacity: 0.6}]}
            txtColor={COLORS.secondary}
            btnColor={COLORS.cartBtn}
            borderColor={COLORS.black}
            icon={btnCart}
            iconPosition={'right'}
            onPress={addItemTocart}
            disabled={isLoading} // Disable button during loading
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    borderColor: COLORS.grayLight,
    borderRadius: SIZES.base,
    marginRight: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    marginVertical: SIZES.radius,
  },
  productImg: {
    width: '100%',
    height: 192,
    resizeMode: 'contain',
  },
  productTitle: {
    color: COLORS.black,
    ...FONTS.body5,
    height: 16 * 4,
  },
  productPrice: {
    color: COLORS.black,
    marginTop: SIZES.base,
    ...FONTS.body3_bold,
  },
  productOldPrice: {
    color: COLORS.gray,
    marginTop: SIZES.base,
    ...FONTS.body3_bold,
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
