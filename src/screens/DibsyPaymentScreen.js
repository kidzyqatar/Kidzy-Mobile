import React, {useCallback, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
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
import {close} from '@constants/icons';
import {COLORS, FONTS, SIZES} from '@constants/theme';

/**
 * Success URLs only — do not match mid-flow paths such as "confirmation" segments on Dibsy
 * (that fired complete-cart too early and broke the session, leading to “Something went wrong” after Pay).
 */
function isPaymentSuccessUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  try {
    const lower = url.toLowerCase();
    const u = new URL(url);
    const path = u.pathname.toLowerCase();
    const host = u.hostname.toLowerCase();

    if (host.includes('dibsy.one') || host.includes('dibsy.')) {
      if (
        /[?&](status|payment_status|paymentstate|result)=(success|succeeded|completed|paid)\b/i.test(
          lower,
        ) ||
        path.includes('payment-success') ||
        path.includes('payment_success') ||
        path.includes('payment-completed') ||
        path.includes('/payment/success') ||
        path.endsWith('/success')
      ) {
        return true;
      }
    }

    if (
      path.includes('payment-success') ||
      path.includes('payment_success') ||
      path.includes('payment-completed') ||
      path.endsWith('/success') ||
      path.includes('/payment/success')
    ) {
      return true;
    }
    if (
      /[?&]payment_status=(success|succeeded|completed)\b/i.test(lower) ||
      /[?&]status=(success|succeeded|completed)\b/i.test(lower)
    ) {
      return true;
    }

    if (host.includes('kidzy.prismatech.agency') && path.includes('thankyou')) {
      return true;
    }

    if (
      host.includes('cloudwaysapps.com') &&
      (path.includes('thankyou') ||
        path.includes('payment-success') ||
        /[?&]status=(success|succeeded)\b/i.test(lower))
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

function isPaymentFailureOrCancelUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  const lower = url.toLowerCase();
  try {
    const path = new URL(url).pathname.toLowerCase();
    return (
      lower.includes('payment-failure') ||
      lower.includes('payment_failure') ||
      lower.includes('payment-failed') ||
      /[?&]status=failed\b/i.test(lower) ||
      /[?&]payment_status=failed\b/i.test(lower) ||
      path.includes('/payment/cancel') ||
      lower.includes('payment-cancel')
    );
  } catch {
    return (
      lower.includes('payment-failure') ||
      lower.includes('payment_failure') ||
      lower.includes('payment-failed')
    );
  }
}

const DibsyPaymentScreen = ({route}) => {
  const {paymentUrl, cartSessionId, orderId, calculations} = route.params || {};
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const completingRef = useRef(false);
  const webViewRef = useRef(null);

  const handleCloseWithoutCompleting = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const completeCartAfterPayment = useCallback(async () => {
    if (completingRef.current) {
      return;
    }
    completingRef.current = true;

    try {
      const response = await callNonTokenApi(config.apiName.completeCart, 'POST', {
        guest_session_id: cartSessionId,
        payment_method: 'DIBSY',
        status: 'PENDING',
        order_id: orderId,
        source: 'mobile_app',
        subtotal: calculations.subtotal,
        discount: Number(calculations.discount).toFixed(2),
        shipping_cost: calculations.shipping,
        tax: String(calculations.tax ?? 0),
        grand_total: Number(calculations.grandTotal).toFixed(2),
        special_delivery_cost: calculations.specialDelivery,
        balloon_cost: calculations.balloons,
        wrapper_cost: calculations.wrapper,
        delivery_date: calculations.delivery_date,
        character_id: calculations.character_id,
      });

      const ok =
        response &&
        !response.error &&
        (response.status === undefined || response.status === 200);

      if (ok) {
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

        RootNavigation.navigationRef.current?.reset({
          index: 0,
          routes: [{name: 'Thankyou'}],
        });
      } else {
        completingRef.current = false;
        const msg =
          response?.message ||
          'Could not confirm your order. If you were charged, contact support.';
        Alert.alert('Payment', msg);
      }
    } catch (error) {
      console.log('Error completing cart after payment:', error);
      completingRef.current = false;
      Alert.alert(
        'Payment',
        'Could not confirm your order. If you were charged, contact support.',
      );
    }
  }, [cartSessionId, orderId, calculations, dispatch]);

  const onNavigationStateChange = useCallback(
    navState => {
      const url = navState?.url || '';

      if (isPaymentFailureOrCancelUrl(url)) {
        RootNavigation.navigate('MyCart');
        return;
      }

      // Wait until the page finishes loading so we don't treat a redirect-in-progress as success.
      if (navState.loading) {
        return;
      }

      if (isPaymentSuccessUrl(url)) {
        completeCartAfterPayment();
      }
    },
    [completeCartAfterPayment],
  );

  /** If the gateway opens a new window for 3DS / return, keep it in this WebView. */
  const onOpenWindow = useCallback(syntheticEvent => {
    const targetUrl = syntheticEvent?.nativeEvent?.targetUrl;
    if (!targetUrl || !webViewRef.current) {
      return;
    }
    const safe = JSON.stringify(targetUrl);
    webViewRef.current.injectJavaScript(
      `window.location.href = ${safe}; true;`,
    );
  }, []);

  // Do not return false for success URLs — Dibsy needs the WebView to complete redirects / 3DS or it can show “try again”.
  const onShouldStartLoadWithRequest = useCallback(request => {
    const url = request?.url || '';

    if (isPaymentFailureOrCancelUrl(url)) {
      RootNavigation.navigate('MyCart');
      return false;
    }

    return true;
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleCloseWithoutCompleting}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          accessibilityRole="button"
          accessibilityLabel="Close payment">
          <Image source={close} style={styles.closeIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.headerSpacer} />
      </View>
      {paymentUrl ? (
        <WebView
          ref={webViewRef}
          style={styles.webview}
          source={{uri: paymentUrl}}
          onNavigationStateChange={onNavigationStateChange}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          onOpenWindow={onOpenWindow}
          setSupportMultipleWindows
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          thirdPartyCookiesEnabled={Platform.OS === 'android'}
          mixedContentMode="always"
          cacheEnabled
          allowsBackForwardNavigationGestures={false}
          originWhitelist={['http://*', 'https://*']}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}
          onHttpError={syntheticEvent => {
            console.warn(
              'Dibsy WebView HTTP error',
              syntheticEvent?.nativeEvent?.statusCode,
              syntheticEvent?.nativeEvent?.description,
            );
          }}
        />
      ) : (
        <View style={styles.loaderWrap}>
          <Text style={styles.errorTxt}>Missing payment link.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default DibsyPaymentScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.grayLight,
  },
  closeIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  headerTitle: {
    ...FONTS.body3,
    color: COLORS.black,
  },
  headerSpacer: {
    width: 24,
  },
  webview: {
    flex: 1,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTxt: {
    ...FONTS.body4,
    color: COLORS.black,
  },
});
