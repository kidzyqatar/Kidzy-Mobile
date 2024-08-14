import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import {DiscountWidget, Heading, Spacer, CartItem, Hr} from '@components';
import globalStyles from '@constants/global-styles';
import {useTranslation} from 'react-i18next';

const StepOne = ({
  cart,
  items,
  calculations,
  calculationsChanger,
  applyCoupon,
  removeCoupon,
  getCart,
}) => {
  const {t} = useTranslation();
  return (
    <>
      {/* Discount Accordion */}
      <DiscountWidget
        coupon={cart?.coupon}
        calculations={calculations}
        calculationsChanger={calculationsChanger}
        applyCoupon={applyCoupon}
        removeCoupon={removeCoupon}
      />
      {/* Discount Accordion */}

      {/* Cart Widget */}
      <View style={globalStyles.whiteBg}>
        <Heading txt={t('cartSummary')} txtStyle={styles.cartHeading} />

        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}>
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

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 240,
    // paddingBottom: 240, // This ensures the content doesn't get cut off at the bottom
  },
  scrollView: {
    flex: 1,
    marginBottom: 80, // This leaves space for the footer
  },
});

export default StepOne;
