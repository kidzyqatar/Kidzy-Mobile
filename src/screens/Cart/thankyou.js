import { View, Text, Image, TextBase } from 'react-native';
import React from 'react';
import { MasterLayout, BackBar, Spacer, MyButton, Phrase } from '@components';
import globalStyles from '@constants/global-styles';
import { COLORS, SIZES, FONTS } from '@constants/theme';
import { thankyouImg } from '@constants/images';
import { styles } from './styles';
import * as RootNavigation from '@navigators/RootNavigation';

const Thankyou = () => {
  return (
    <MasterLayout bgColor={COLORS.bgGray} scrolling={false} max={true}>
      <View style={globalStyles.whiteBg}>
        <BackBar title={'Order Complete'} navigateTo={'HomeScreen'} />
      </View>
      <Spacer />
      <View style={styles.thankyouContainer}>
        <Image source={thankyouImg} style={styles.thankyouImgImg} />
        <Phrase txt={'Order Placed!'} txtStyle={styles.thankyouHeading} />
        <Phrase
          txt={
            'Thank you for shopping with Kidzy. Your items are being prepared and will be delivered shortly'
          }
          txtStyle={styles.thankyouContent}
        />
        <MyButton
          label={'Back to home'}
          txtColor={COLORS.white}
          btnColor={COLORS.secondary}
          borderColor={COLORS.secondary}
          onPress={() => {
            RootNavigation.navigate('HomeScreen');
          }}
          btnStyle={{ width: SIZES.fourty }}
        />
      </View>
    </MasterLayout>
  );
};

export default Thankyou;
