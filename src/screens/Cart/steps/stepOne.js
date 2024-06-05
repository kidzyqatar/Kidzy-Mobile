import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { DiscountWidget, Heading, Spacer, CartItem, Hr } from '@components';
import globalStyles from '@constants/global-styles';
const StepOne = ({ cart, items, calculations, calculationsChanger, applyCoupon, removeCoupon, getCart }) => {
  return (
    <>
      {/* Discount Accordian */}
      <DiscountWidget
        coupon={cart?.coupon}
        calculations={calculations}
        calculationsChanger={calculationsChanger}
        applyCoupon={applyCoupon}
        removeCoupon={removeCoupon}
      />
      {/* Discount Accordian */}

      {/* Cart Widget */}
      <View style={globalStyles.whiteBg}>
        <Heading txt={'Cart Summary'} txtStyle={styles.cartHeading} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {items.map((elem, index) => {
            return (
              <React.Fragment key={index.toString()}>
                <Spacer />
                <CartItem item={elem} />
                <Hr />
              </React.Fragment>
            );
          })}
        </ScrollView>
      </View>
      {/* Cart Widget */}
    </>
  );
};

export default StepOne;
