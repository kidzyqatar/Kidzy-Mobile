import React from 'react';
import {WebView} from 'react-native-webview';

const DibsyPaymentScreen = ({paymentUrl}) => {
  return (
    <WebView
      source={{uri: paymentUrl}}
      onNavigationStateChange={navState => {
        if (navState.url.includes('payment-success')) {
          // Handle success
        } else if (navState.url.includes('payment-failure')) {
          // Handle failure
        }
      }}
    />
  );
};

export default DibsyPaymentScreen;
