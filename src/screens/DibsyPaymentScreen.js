import React from 'react';
import {WebView} from 'react-native-webview';
import * as RootNavigation from '../navigators/RootNavigation';
import {callNonTokenApi} from '../helpers/ApiRequest';
import config from '../constants/config';
import {useDispatch} from 'react-redux';
import {
  setCart,
  setCartSessionID,
  setSelectedBillingAddress,
  setSelectedShippingAddress,
  setBallonsCount,
  setSelectedCharacter,
  setSelectedDeliveryDate,
  setSelectedDeliveryTime,
  setSameAsBillingAddress,
  setSendtoFriend,
  clearGuestInfo,
} from '../store/reducers/global';

const DibsyPaymentScreen = ({route}) => {
  const {paymentUrl, cartSessionId, orderId, calculations} = route.params; // Add calculations
  const dispatch = useDispatch();
  
  const completeCartAfterPayment = async () => {
    try {
      const response = await callNonTokenApi(config.apiName.completeCart, 'POST', {
        guest_session_id: cartSessionId,
        payment_method: 'online',
        status: 'PENDING', // Keep as PENDING for manual processing
        order_id: orderId,
        source: 'mobile_app',
        // Add all calculation fields to prevent overwriting
        subtotal: calculations.subtotal,
        discount: Number(calculations.discount).toFixed(2),
        shipping_cost: calculations.shipping,
        tax: calculations.tax || 0,
        grand_total: Number(calculations.grandTotal).toFixed(2),
        special_delivery_cost: calculations.specialDelivery,
        balloon_cost: calculations.balloons,
        wrapper_cost: calculations.wrapper,
        delivery_date: calculations.delivery_date,
        character_id: calculations.character_id,
      });
      
      if (response && !response.error) {
        // Reset cart state
        dispatch(setCart({}));
        dispatch(setCartSessionID(''));
        dispatch(clearGuestInfo());
        dispatch(setSelectedBillingAddress(null));
        dispatch(setSelectedShippingAddress(null));
        dispatch(setBallonsCount(0));
        dispatch(setSelectedCharacter(null));
        dispatch(setSelectedDeliveryDate(''));
        dispatch(setSelectedDeliveryTime(''));
        dispatch(setSameAsBillingAddress(false));
        dispatch(setSendtoFriend(false));
        
        // Navigate to app's Thankyou screen immediately
        RootNavigation.navigationRef.current?.reset({
          index: 0,
          routes: [{ name: 'Thankyou' }],
        });
      }
    } catch (error) {
      console.log('Error completing cart after payment:', error);
      // Still navigate to Thankyou even if there's an error
      RootNavigation.navigationRef.current?.reset({
        index: 0,
        routes: [{ name: 'Thankyou' }],
      });
    }
  };

  return (
    <WebView
      source={{uri: paymentUrl}}
      onNavigationStateChange={async (navState) => {
        console.log('WebView navigation:', navState.url);
        
        // Intercept before reaching the web thank you page
        // Check for payment success indicators earlier in the flow
        if (navState.url.includes('payment-success') || 
            navState.url.includes('success') ||
            navState.url.includes('completed') ||
            (navState.url.includes('kidzy.prismatech.agency') && 
             (navState.url.includes('thankyou') || navState.url.includes('thank')))) {
          console.log('Payment successful, completing cart and navigating directly to app thankyou...');
          // Prevent the WebView from continuing to load the web thank you page
          // Complete cart and navigate immediately
          await completeCartAfterPayment();
          return false; // Stop further navigation
        } else if (navState.url.includes('payment-failure') || navState.url.includes('failed')) {
          console.log('Payment failed, returning to cart...');
          RootNavigation.navigate('MyCart');
          return false; // Stop further navigation
        }
      }}
      onShouldStartLoadWithRequest={(request) => {
        // Additional check to prevent loading the web thank you page
        if (request.url.includes('kidzy.prismatech.agency/en/thankyou')) {
          console.log('Intercepting web thankyou page, going directly to app thankyou...');
          completeCartAfterPayment();
          return false; // Prevent loading the web page
        }
        return true; // Allow other URLs to load
      }}
    />
  );
};

export default DibsyPaymentScreen;
